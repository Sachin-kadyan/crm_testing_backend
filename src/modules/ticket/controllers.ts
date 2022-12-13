import { NextFunction, Request, Response } from "express";
import { ClientSession, ObjectId } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { putMedia } from "../../services/aws/s3";
import { iEstimate, iPrescription, iTicket } from "../../types/ticket/ticket";
import ErrorHandler from "../../utils/errorHandler";
import { findConsumerById } from "../consumer/functions";
import { findDoctorById, getDepartmentById } from "../department/functions";
import { getSortedLeadCountRepresentatives } from "../representative/functions";
import { findStageByCode } from "../stages/functions";
import { createOnePrescription } from "./crud";
import {
  createTicketHandler,
  getAllTicketHandler,
  getConsumerTicketsWithPrescription,
  searchConsumer,
} from "./functions";

type ticketBody = iTicket & iPrescription;

export const createTicket = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    if (!req.file) {
      throw new ErrorHandler("Prescription image not found", 400, [
        { error: "Prescription image not found" },
      ]);
    }
    const ticket: ticketBody = req.body;

    const consumer = await findConsumerById(ticket.consumer);
    if (consumer === null) {
      throw new ErrorHandler("consumer doesn't exist", 404, [{ error: "consumer doesn't exist " }]);
    }
    const departments: string[] = JSON.parse(req.body.departments);
    departments.forEach((item) => {
      getDepartmentById(new ObjectId(item)).then((dept) => {
        if (dept === null) {
          throw new ErrorHandler("Invalid department passed", 400, [{ error: "Invalid department passed" }]);
        }
      });
    });

    const doctor = await findDoctorById(ticket.doctor);
    if (doctor === null) {
      throw new ErrorHandler("Invalid doctor id passed", 400, [{ error: "Invalid Doctor id passed" }]);
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
      new ErrorHandler("failed to create prescription", 400, [{ error: "failed to create prescription" }]);
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
  const { status, body } = await searchConsumer(search, departmentType);
  return res.status(status).json(body);
});

export const ticketsWithPrescription = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await getConsumerTicketsWithPrescription(new ObjectId(req.params.consumerId));
    return res.status(200).json(tickets);
  }
);

// prescription
export const createEstimate = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    const estimateBody: iEstimate = req.body;
    const tickets = await getConsumerTicketsWithPrescription(new ObjectId(req.params.consumerId));
    return res.status(200).json(tickets);
  }
);
