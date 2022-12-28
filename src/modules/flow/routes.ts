import { Router } from "express";
import * as validations from "./validations";
import * as controllers from "./controller";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import isAdmin from "../../middleware/authorization/isAdmin";

const router = Router();
router.use(isLoggedIn);
router.route("/reply").post(validations.createReply, controllers.createReplyNodeController);
router.route("/list").post(validations.createList, controllers.createListNodeController);
router.route("/connect").post(isAdmin, validations.connect_flow, controllers.ConnectFlow);
router.route("/webhook").post(controllers.HandleWebhook);
export default router;
