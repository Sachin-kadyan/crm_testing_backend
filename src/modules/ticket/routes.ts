import { Router } from "express";
import multer from "multer";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as controllers from "./controllers";
import * as validations from "./validations";

const upload = multer();

const router: Router = Router();
router.use(isLoggedIn);
router
  .route("/")
  .post(upload.single("image"), validations.create, controllers.createTicket)
  .get(controllers.getAllTicket);
router.route("/:consumerId").get(controllers.ticketsWithPrescription);
router.route("/estimate").post(validations.createEstimate, controllers.createEstimate);
router.route("/search").get(controllers.search);

export default router;
