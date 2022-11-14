import { Router } from "express";
import representative from "./representative/routes";
import consumer from "./consumer/routes";
const router = Router();

router.use("/representative", representative);
router.use("/consumer", consumer);

export default router;
