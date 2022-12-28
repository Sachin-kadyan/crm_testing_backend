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
  const status = err.code || 500;
  const message = err.message || "Internal Server Error";
  console.log(status, message);
  return res.status(status).json({ message: message });
});

MongoService.init().then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running at ${PORT}`);
  });
});
