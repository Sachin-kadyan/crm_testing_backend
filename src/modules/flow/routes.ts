import { Router } from "express";
import * as validations from "./validations";
import * as controllers from "./controller";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import isAdmin from "../../middleware/authorization/isAdmin";

const router = Router();
router.route("/reply").post(isLoggedIn, validations.createReply, controllers.createReplyNodeController);
router.route("/list").post(isLoggedIn, validations.createList, controllers.createListNodeController);
router.route("/connect").post(isLoggedIn, isAdmin, validations.connect_flow, controllers.ConnectFlow);
router.route("/webhook").post(controllers.HandleWebhook);
export default router;
