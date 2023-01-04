import { ClientSession, Collection, ObjectId } from "mongodb";
import Schedule from "node-schedule";
import { sendTemplateMessage } from "../../services/whatsapp/whatsapp";
import { iReminder, iTodo } from "../../types/task/task";
import MongoService, { Collections } from "../../utils/mongo";
import { createReminderTemplate } from "./utils";

export const createReminder = async (reminder: iReminder, session: ClientSession, phone: string) => {
  const date = new Date(reminder.date);
  Schedule.scheduleJob(date, async () => {
    const components = createReminderTemplate(reminder.title, reminder.description);
    await sendTemplateMessage(phone.length === 10 ? "91" + phone : phone, "reminder", "en", components);
  });
  await MongoService.collection(Collections.REMINDER).insertOne(reminder, { session });
  return reminder;
};

export const findCreatorReminders = async (creator: ObjectId) => {
  return await MongoService.collection(Collections.REMINDER).find({ creator }).toArray();
};

export const findTicketReminders = async (ticket: ObjectId) => {
  return await MongoService.collection(Collections.REMINDER).find({ ticket }).toArray();
};

// todo

export const createTodo = async (todo: iTodo, session: ClientSession) => {
  await MongoService.collection(Collections.TODO).insertOne(todo, { session });
  return todo;
};

export const findCreatorTodo = async (creator: ObjectId) => {
  return await MongoService.collection(Collections.TODO).find({ creator }).toArray();
};

export const findTicketTodo = async (ticket: ObjectId) => {
  return await MongoService.collection(Collections.TODO).find({ ticket }).toArray();
};
