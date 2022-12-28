import { NextFunction, Request, Response } from "express";
import { ClientSession, ObjectId } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { putMedia } from "../../services/aws/s3";
import { iEstimate, iPrescription, iTicket } from "../../types/ticket/ticket";
import ErrorHandler from "../../utils/errorHandler";
import { findConsumer } from "../consumer/crud";
import { findConsumerById } from "../consumer/functions";
import { findDoctorById, getDepartmentById, getWardById } from "../department/functions";
import { getSortedLeadCountRepresentatives } from "../representative/functions";
import { getServiceById } from "../service/functions";
import { findStageByCode } from "../stages/functions";
import { createOnePrescription, findPrescription, findPrescriptionById, findTicket } from "./crud";
import {
  createEstimate,
  createNote,
  createTicketHandler,
  getAllTicketHandler,
  getConsumerPrescriptions,
  getConsumerTickets,
  getPrescriptionById,
  getTicketEstimates,
  getTicketNotes,
  searchService,
} from "./functions";

type ticketBody = iTicket & iPrescription;

export const createTicket = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    if (!req.file) {
      throw new ErrorHandler("Prescription image not found", 400);
    }
    const ticket: ticketBody = req.body;

    const consumer = await findConsumerById(ticket.consumer);
    if (consumer === null) {
      throw new ErrorHandler("consumer doesn't exist", 404);
    }
    const departments: string[] = JSON.parse(req.body.departments);
    departments.forEach((item) => {
      getDepartmentById(new ObjectId(item)).then((dept) => {
        if (dept === null) {
          throw new ErrorHandler("Invalid department passed", 400);
        }
      });
    });

    const doctor = await findDoctorById(ticket.doctor);
    if (doctor === null) {
      throw new ErrorHandler("Invalid doctor id passed", 400);
    }
    const { Key } = await putMedia(req.file, `patients/${ticket.consumer}/prescription`);
    //create prescription
    const { _id } = await createOnePrescription(
      {
        admission: ticket.admission,
        condition: ticket.condition,
        consumer: ticket.consumer,
        departments: JSON.parse(req.body.departments).map((item: string) => new ObjectId(item)),
        diagnostics: ticket.diagnostics ? (JSON.parse(req.body.diagnostics) as string[]) : null,
        medicines: ticket.medicines ? JSON.parse(req.body.medicines) : null,
        doctor: ticket.doctor,
        followUp: ticket.followUp,
        image: Key,
        symptoms: ticket.symptoms,
      },
      session
    );
    // finally create ticket
    if (!_id) {
      new ErrorHandler("failed to create prescription", 400);
    } else {
      const stage = await findStageByCode(0);
      const representatives = await getSortedLeadCountRepresentatives();
      const { status, body } = await createTicketHandler({
        consumer: ticket.consumer,
        prescription: _id,
        creator: new ObjectId(req.user!._id),
        assigned: representatives[0]._id,
        stage: stage._id!,
      });
      return res.status(status).json(body);
    }
  }
);

export const getAllTicket = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const tickets = await getAllTicketHandler();
  return res.status(200).json(tickets);
});

export const search = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { search, departmentType } = <{ search: string; departmentType: string }>req.query;
  const { status, body } = await searchService(search, departmentType);
  return res.status(status).json(body);
});

export const ticketsWithPrescription = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await getConsumerTickets(new ObjectId(req.params.consumerId));
    const prescriptions = await getConsumerPrescriptions(new ObjectId(req.params.consumerId));
    // mapping tickets with prescription
    const consumerTicketsWithPrescription: any = [];
    prescriptions.forEach((pres) => {
      const prescriptionTicket = tickets.find(
        (item) => item.prescription.toString() === pres._id?.toString()
      );
      if (prescriptionTicket) {
        consumerTicketsWithPrescription.push({ ...prescriptionTicket, prescription: pres });
      }
    });
    return res.status(200).json(consumerTicketsWithPrescription);
  }
);

export const getRepresentativeTickets = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await findTicket({ creator: new ObjectId(req.user!._id) });
    const prescriptionIds: ObjectId[] = [];
    const consumerIds: ObjectId[] = [];
    tickets.forEach((ticket) => {
      prescriptionIds.push(ticket.prescription);
      consumerIds.push(ticket.consumer);
    });
    const prescriptions = await findPrescription({ _id: { $in: prescriptionIds } });
    const consumers = await findConsumer({ _id: { $in: consumerIds } });
    const populatedTickets: any = [...tickets];
    tickets.forEach(async (ticket, index) => {
      populatedTickets[index].prescription = prescriptions[index];
      populatedTickets[index].consumer = consumers[index];
    });
    return res.status(200).json(populatedTickets);
  }
);

// estimate
type iEstimateBody = Omit<iEstimate, "creator">;

export const createEstimateController = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const estimateBody: iEstimateBody = req.body;
    if (req.body.icuType) {
      const icuTypeCheck = await getWardById(estimateBody.icuType);
      if (icuTypeCheck === null) throw new ErrorHandler("Invalid ICU Type", 400);
    }
    estimateBody.service.forEach(async (item) => {
      const service = await getServiceById(item.id);
      if (service === null) {
        return res.status(400).json({ message: "Invalid Service Id" });
      }
    });
    const prescription = await getPrescriptionById(estimateBody.prescription);
    if (prescription === null) {
      throw new ErrorHandler("Invalid Prescription", 400);
    }
    const estimate = await createEstimate({ ...estimateBody, creator: new ObjectId(req.user!._id) }, session);
    return res.status(200).json(estimate);
  }
);

export const GetTicketEstimates = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const estimates = await getTicketEstimates(new ObjectId(req.params.ticketId));
  res.status(200).json(estimates);
});

// note
export const CreateNote = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const note = await createNote(
      {
        text: req.body.text,
        ticket: req.body.ticket,
        createdAt: Date.now(),
        creator: req.user!._id,
      },
      session
    );
    res.status(200).json(note);
  }
);

export const GetTicketNotes = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const notes = await getTicketNotes(new ObjectId(req.params.ticketId));
  res.status(200).json(notes);
});
