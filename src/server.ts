import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import express, { Express, Response, Request, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import moduleRoutes from "./modules/routes";
import ErrorHandler from "./utils/errorHandler";
import MongoService, { Collections } from "./utils/mongo";
import seed from "./seed/seed";
import { followUpMessage } from "./services/whatsapp/whatsapp";
import { ObjectId } from "mongodb";
import { iPrescription } from "./types/ticket/ticket";
import { findDoctorById } from "./modules/department/functions";
import { findOneConsumer } from "./modules/consumer/crud";
import { findTicketById } from "./modules/ticket/crud";

// const cron = require("node-cron");

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

const app: Express = express();
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cors());

app.get("/prod/", async (req: Request, res: Response) => {
  res.send("howdy!");
});

app.use("/prod/api/v1/", moduleRoutes);
// app.use("/cron", followUpMessage);

// cron.schedule(" 05 * * * * * ", function () {
//   followUpMessage("919452760854", "followup", "en");

//   console.log("running a task every 15 seconds");
// });

// cron.schedule(" 42 10 * * *", async () => {
//   const doctorId = new ObjectId("63f726edaa317c7daa4310e6");
//   const doctor = await findDoctorById(doctorId);
//   console.log(doctor);

//   const query = { phone: "91945276854" };
//   const consumer2 = await findOneConsumer(query);
//   console.log(consumer2);

//   console.log(consumer2?.phone);

//   const ticketId = new ObjectId("63f729c2aa317c7daa4310ef");
//   const ticket = await findTicketById(ticketId);
//   console.log(ticket);

//   console.log(ticket?.consumer);
// });

app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const status = err.code || 500;
    const message = err.message || "Internal Server Error";
    console.log(status, message);
    return res.status(status).json({ message: message });
  }
);

MongoService.init().then(() => {
  app.listen(PORT, async () => {
    await seed();
    console.log(`Server running at ${PORT}`);
  });
});
