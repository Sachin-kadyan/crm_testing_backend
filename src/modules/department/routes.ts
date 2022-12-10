import { Router } from "express";
import isAdmin from "../../middleware/authorization/isAdmin";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as controllers from "./controllers";
import * as validations from "./validations";

const router: Router = Router();
router
  .route("/")
  .post(isLoggedIn, isAdmin, validations.create, controllers.addDepartment)
  .get(isLoggedIn, controllers.getDepartments);

router
  .route("/doctor")
  .post(isLoggedIn, isAdmin, validations.createDoctor, controllers.createDoctor)
  .get(isLoggedIn, controllers.getDoctors);

router
  .route("/tag")
  .post(isLoggedIn, isAdmin, validations.createDepartmentTag, controllers.createDepartmentTag)
  .get(isLoggedIn, controllers.getDepartmentTags);

export default router;
