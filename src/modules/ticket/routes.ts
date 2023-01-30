import { Router } from "express";
import multer from "multer";
import { isRepresentative } from "../../middleware/authorization/isAdmin";
import isLoggedIn from "../../middleware/authorization/isLoggedIn";
import * as controllers from "./controllers";
import * as validations from "./validations";

const upload = multer();

const router: Router = Router();
router.use(isLoggedIn);
router
  .route("/")
  .post(upload.single("image"), validations.create, controllers.createTicket)
  .get(isRepresentative, controllers.getRepresentativeTickets);
router.route("/:consumerId").get(controllers.ticketsWithPrescription);
router.route("/estimate").post(validations.createEstimate, controllers.createEstimateController);
router.route("/estimate/:ticketId").get(validations.get_estimate, controllers.GetTicketEstimates);
router
  .route("/:ticketId/estimate/upload")
  .post(upload.single("estimate"), validations.upload_estimate, controllers.EstimateUploadAndSend);
router.route("/note").post(validations.create_note, controllers.CreateNote);
router.route("/note/:ticketId").get(validations.get_notes, controllers.GetTicketNotes);
export default router;
