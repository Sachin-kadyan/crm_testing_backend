import { ClientSession } from "mongodb";
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

export const createTodo = async (todo: iTodo, session: ClientSession) => {
  await MongoService.collection(Collections.TODO).insertOne(todo, { session });
  return todo;
};
