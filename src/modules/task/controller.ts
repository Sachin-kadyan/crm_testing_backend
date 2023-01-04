import { NextFunction, Request, Response } from "express";
import { ClientSession, ObjectId } from "mongodb";
import PromiseWrapper from "../../middleware/promiseWrapper";
import { iReminder, iTodo } from "../../types/task/task";
import ErrorHandler from "../../utils/errorHandler";
import { findTicketById } from "../ticket/crud";
import { createReminder, createTodo } from "./functions";

export const CreateReminder = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    if (req.body.date < Date.now()) throw new ErrorHandler("Invalid Schedule Time", 400);
    const ticket = await findTicketById(req.body.ticket);
    if (ticket === null) throw new ErrorHandler("No Ticket Found", 404);
    const reminderPayload: iReminder = { ...req.body, creator: new ObjectId(req.user!._id) };
    const reminder = await createReminder(reminderPayload, session, req.user!.phone);
    res.status(200).json(reminder);
  }
);

export const CreateTodo = PromiseWrapper(
  async (req: Request, res: Response, next: NextFunction, session: ClientSession) => {
    if (req.body.date < Date.now()) throw new ErrorHandler("Invalid Due Date", 400);
    const ticket = await findTicketById(req.body.ticket);
    if (ticket === null) throw new ErrorHandler("No Ticket Found", 400);
    const todoPayload: iTodo = { ...req.body, creator: new ObjectId(req.user!._id), status: false };
    const todo = await createTodo(todoPayload, session);
    res.status(200).json(todo);
  }
);
