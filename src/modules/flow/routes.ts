import { Router } from "express";
import * as validations from "./validations";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";

const router = Router();
router.use(isLoggedIn);
router.route("/reply").post(validations.createReplyNode, (req: any, res: any) => {
  res.sendStatus(200);
});

export default router;
