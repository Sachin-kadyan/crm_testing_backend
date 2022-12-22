import { Router } from "express";
import * as validations from "./validations";
import * as controllers from "./controller";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";

const router = Router();
router.use(isLoggedIn);
router.route("/reply").post(validations.createReply, controllers.createReplyNodeController);

export default router;
