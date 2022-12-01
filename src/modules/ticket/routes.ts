import { Router } from "express";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as controllers from "./controllers";
import * as validations from "./validations";

const router: Router = Router();
router.use(isLoggedIn);
router.route("/").post(validations.create, controllers.createService);
router.route("/search").get(controllers.search);

export default router;
