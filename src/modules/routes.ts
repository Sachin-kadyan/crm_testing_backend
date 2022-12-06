import { Router } from "express";
import representative from "./representative/routes";
import consumer from "./consumer/routes";
import service from "./service/routes";
import department from "./department/routes";
import stage from "./stages/routes";
const router = Router();

router.use("/representative", representative);
router.use("/consumer", consumer);
router.use("/service", service);
router.use("/department", department);
router.use("/stage", stage);

export default router;
