import { NextFunction, Request, Response } from "express";
import { ClientSession } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { iReminder } from "../../types/task/task";
import ErrorHandler from "../../utils/errorHandler";
import { findTicketById } from "../ticket/crud";
import { createReminder } from "./functions";

export const CreateReminder = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    if (req.body.date < Date.now()) throw new ErrorHandler("Invalid Schedule Time", 400);
    const ticket = await findTicketById(req.body.ticket);
    if (ticket === null) throw new ErrorHandler("No Ticket Found", 404);
    const reminderPayload: iReminder = { ...req.body, creator: req.user!._id };
    const reminder = await createReminder(reminderPayload, session, req.user!.phone);
    res.status(200).json(reminder);
  }
);
