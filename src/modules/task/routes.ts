import { Router } from "express";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as validations from "./validations";
import * as controllers from "./controller";

const router = Router();

router.use(isLoggedIn);
router
  .route("/reminder")
  .post(validations.create_reminder, controllers.CreateReminder)
  .get(controllers.GetReminder);
router.route("/reminder/:ticketId").get(controllers.GetTicketReminders);
router.route("/todo").post(validations.create_todo, controllers.CreateTodo).get(controllers.GetCreatorTodo);
router.route("/todo/:ticketId").get(controllers.GetTicketTodo);

export default router;
