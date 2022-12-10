import { Router } from "express";
import isAdmin from "../../middleware/authorization/isAdmin";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as controllers from "./controllers";
import * as validations from "./validations";

const router: Router = Router();
router.use(isLoggedIn);
router
  .route("/")
  .post(isAdmin, validations.create, controllers.addDepartment)
  .get(controllers.getDepartments);

router
  .route("/doctor")
  .post(isAdmin, validations.createDoctor, controllers.createDoctor)
  .get(controllers.getDoctors);

router
  .route("/tag")
  .post(isAdmin, validations.createDepartmentTag, controllers.createDepartmentTag)
  .get(controllers.getDepartmentTags);

export default router;
