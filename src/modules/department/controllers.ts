import { NextFunction, Request, Response } from "express";
import PromiseWrapper from "../../middleware/promiseWrapper";
import {
  createDepartmentHandler,
  createDoctorHandler,
  findAllDepartmentTagsHandler,
  getAllDepartments,
  getDoctorsHandler,
} from "./functions";

export const addDepartment = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await createDepartmentHandler(req.body);
  res.status(status).json(body);
});

export const getDepartments = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await getAllDepartments(req.query.parent === "true" && true);
  res.status(status).json(body);
});

export const createDoctor = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { status, body } = await createDoctorHandler(req.body.name, req.body.department);
  res.status(status).json(body);
});

export const getDoctors = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const department = req.query.department ? (req.query.department as string) : undefined;
  const subDepartment = req.query.subDepartment ? (req.query.subDepartment as string) : undefined;
  const { status, body } = await getDoctorsHandler(department, subDepartment);
  res.status(status).json(body);
});

export const createDepartmentTag = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const tag = await createDepartmentHandler(req.body.name);
  res.status(200).json(tag);
});

export const getDepartmentTags = PromiseWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const tags = await findAllDepartmentTagsHandler();
  res.status(200).json(tags);
});
