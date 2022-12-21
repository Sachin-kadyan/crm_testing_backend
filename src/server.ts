import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import express, { Express, Response, Request, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import morgan from 'morgan'
import moduleRoutes from "./modules/routes";
import ErrorHandler from "./utils/errorHandler";
import MongoService from "./utils/mongo";
import { createSearchIndex, createUniqueServiceIndex } from "./modules/service/crud";
import { createEstimate } from "./modules/ticket/functions";
import generateEstimate from "./modules/ticket/estimate/createEstimate";
import { ObjectId } from "mongodb";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

const app: Express = express();
const PORT = process.env.PORT;

// app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.send("howdy!");
});

app.use("/api/v1/", moduleRoutes);
app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code ? err.code : 500).json({ message: err.message });
  next();
});

app.listen(PORT, async () => {
  await MongoService.init();
  // await createSearchIndex();
  // await createUniqueServiceIndex();
  console.log(`server running at ${PORT}`);
  // generateEstimate(new ObjectId("639f01ae1e249a18f31779f1"));
});
