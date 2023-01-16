import { Router } from "express";
import isAdmin from "../../middleware/authorization/isAdmin";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as controllers from "./controllers";
import * as validations from "./validations";

const router: Router = Router();

router.use(isLoggedIn);
router
  .route("/")
  .post(isAdmin, validations.create_script, controllers.CreateScript)
  .get(validations.get_scripts, controllers.GetScripts);
router.route("/:serviceId/:stageId").get(validations.get_script, controllers.GetScript);

export default router;
