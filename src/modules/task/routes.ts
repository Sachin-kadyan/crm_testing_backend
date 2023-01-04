import { Router } from "express";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as validations from "./validations";
import * as controllers from "./controller";

const router = Router();
router.use(isLoggedIn);
router.route("/reminder").post(validations.create_reminder, controllers.CreateReminder);
router.route("/todo").post(validations.create_todo, controllers.CreateTodo);

export default router;
