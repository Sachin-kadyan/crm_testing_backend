import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { putMedia } from "../../services/aws/s3";
import { iPrescription, iTicket } from "../../types/ticket/ticket";
import ErrorHandler from "../../utils/errorHandler";
import { findConsumerById } from "../consumer/functions";
import { findDoctorById, getDepartmentById } from "../department/functions";
import { createOnePrescription } from "./crud";
import { createTicketHandler, searchConsumer } from "./functions";

type ticketBody = iTicket & iPrescription;

export const createTicket = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new ErrorHandler("Prescription image not found", 400, [{ error: "Prescription image not found" }]);
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
  const prescription = JSON.parse(JSON.stringify(ticket));
  delete prescription.representative;
  delete prescription.prescription;
  delete prescription.stage;
  prescription.medicines = prescription.medicines ? JSON.parse(prescription.medicines) : null;
  prescription.diagnostics = prescription.diagnostics ? [prescription.diagnostics] : null;
  prescription.departments = departments;
  prescription.image = Key;
  await createOnePrescription(prescription);
  // finally create ticket
  const { status, body } = await createTicketHandler({
    consumer: ticket.consumer,
    prescription: ticket.prescription,
    representative: req.user!._id,
    stage: "",
  });
  return res.status(status).json(body);
});

export const search = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { search, departmentType } = <{ search: string; departmentType: string }>req.query;
  const { status, body } = await searchConsumer(search, departmentType);
  return res.status(status).json(body);
});
