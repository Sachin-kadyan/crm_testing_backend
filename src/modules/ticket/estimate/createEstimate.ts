import { ObjectId } from "mongodb";
import PDFDocument from "pdfkit";
import ErrorHandler from "../../../utils/errorHandler";
import { findConsumerById } from "../../consumer/functions";
import { findDoctorById, getAllWards } from "../../department/functions";
import { findPrescriptionById, findServices, findTicketById } from "../crud";
import { findEstimateById } from "../functions";
import blobStream from "blob-stream";
import { putMedia } from "../../../services/aws/s3";
import { sendMessage } from "../../../services/whatsapp/whatsapp";
import { whatsappEstimatePayload } from "./utils";
import { iEstimate, iTicket } from "../../../types/ticket/ticket";
const BUCKET_NAME = process.env.PUBLIC_BUCKET_NAME;

const generateEstimate = async (estimateId: ObjectId) => {
  let estimate: iEstimate,
    ticket: iTicket,
    servicesArray: any[] = [],
    investigationArray: any[] = [],
    procedureArray: any[] = [];
  findEstimateById(estimateId).then((res) => {
    if (res === null) throw new ErrorHandler("Invalid estimate", 400);
    estimate = res;
    estimate.service.forEach((item) => {
      servicesArray.push(item.id);
    });
    if (estimate.investigation) {
      estimate.investigation.forEach((item) => investigationArray.push(item.id));
    }
    if (estimate.procedure) {
      estimate.procedure.forEach((item) => procedureArray.push(item.id));
    }
    findTicketById(estimate!.ticket)
      .then((ticketRes) => {
        ticket = ticketRes!;
      })
      .then(async (_) => {
        Promise.all([
          findPrescriptionById(ticket!.prescription),
          findConsumerById(ticket!.consumer),
          getAllWards(),
          findServices({ _id: { $in: servicesArray } }),
          findServices({ _id: { $in: investigationArray } }),
          findServices({ _id: { $in: procedureArray } }),
        ]).then(([prescription, consumer, wards, services, investigations, procedures]) => {
          const charges = {
            service: <number[]>[],
            room: <number[]>[],
            investigation: <number[]>[],
            procedure: <number[]>[],
            medicines: <number[]>[],
            equipment: <number[]>[],
            blood: <number[]>[],
            other: <number[]>[],
            total: <number[]>[],
          };

          wards
            .filter((item) => item.type === 0)
            .forEach((item, index) => {
              charges.room.push(
                estimate.type === 1
                  ? item.roomRent * estimate.wardDays +
                      wards.find((item) => item!._id === estimate.icuType)!.roomRent * estimate.icuDays
                  : 0
              );
              let servicePrice = 0;
              services.forEach((service: Record<string, any>) => {
                let charge: number = service[item.code];
                servicePrice += charge;
              });
              let investigationPrice = 0;
              investigations.forEach((investigation: Record<string, any>) => {
                let charge: number = investigation[item.code];
                investigationPrice += charge;
              });
              let procedurePrice = 0;
              procedures.forEach((procedure: Record<string, any>) => {
                let charge: number = procedure[item.code];
                procedurePrice += charge;
              });
              charges.service.push(servicePrice);
              charges.investigation.push(investigationPrice);
              charges.procedure.push(procedurePrice);
              charges.medicines.push(estimate.medicineAmount ? estimate.medicineAmount : 0);
              charges.equipment.push(estimate.equipmentAmount ? estimate.equipmentAmount : 0);
              charges.blood.push(estimate.bloodAmount ? estimate.bloodAmount : 0);
              charges.other.push(estimate.additionalAmount ? estimate.additionalAmount : 0);
              charges.total.push(
                servicePrice +
                  investigationPrice +
                  procedurePrice +
                  (estimate.medicineAmount ? estimate.medicineAmount : 0) +
                  (estimate.bloodAmount ? estimate.bloodAmount : 0) +
                  (estimate.equipmentAmount ? estimate.equipmentAmount : 0) +
                  (estimate.additionalAmount ? estimate.additionalAmount : 0)
              );
            });
          console.log(charges);
          const document = new PDFDocument();
          const stream = document.pipe(blobStream());
          let buffers: any = [];
          document.on("data", buffers.push.bind(buffers));
          //   hospital information
          document
            .fontSize(10)
            .text("Paras Healthcare", 200, 50, { align: "right" })
            .text("123 Main Street", 200, 65, { align: "right" })
            .text("New Delhi, India", 200, 80, { align: "right" })
            .moveDown();
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 90).lineTo(550, 90).stroke();
          document
            .fontSize(10)
            .text(`S.NO: ${consumer?.uid + "-" + Date.now()}`, 50, 100)
            .font("Helvetica-Bold")
            .font("Helvetica")
            .text(`${new Date().toDateString()}`, 50, 115)
            .font("Helvetica-Bold")
            .text(`Name: ${consumer?.firstName + " " + consumer?.lastName}`, 250, 100)
            .font("Helvetica")
            .text(`Phone: ${consumer?.phone}`, 250, 115)
            .text(
              `Address: ${consumer?.address.house} ${consumer?.address.city} ${consumer?.address.state} ${consumer?.address.postalCode}`,
              250,
              130
            )
            .text(`UHID: ${consumer?.uid}`, 400, 100)
            // .text(`Doctor: ${prescription?.doctor}`, 400, 115)
            .text("Specialty: " + "Gurgaon", 400, 115)
            .moveDown();
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 140).lineTo(550, 140).stroke();
          document
            .fontSize(10)
            .font("Helvetica")
            .text(
              `Payment Type: ${
                estimate.paymentType === 0 ? "Cash" : estimate.paymentType === 1 ? "Insurance" : "CGHS"
              }`,
              50,
              150
            )
            .text(`Insurance: ${estimate.paymentType === 1 ? estimate.insuranceCompany : ""}`, 50, 165)
            .text(`Name of Surgery/Package: ${services[0].name}`, 50, 180)
            .text(`Reason for ADM: ${estimate.type === 0 ? "Packaged" : "Surgery"}`, 400, 150)
            .text(`Est LOS: ${estimate.type === 1 ? estimate.wardDays + estimate.icuDays : ""}`, 400, 165)
            .text(
              `Policy Amount: ${estimate.paymentType === 1 ? estimate.insurancePolicyNumber : ""}`,
              400,
              180
            );

          document
            .fontSize(10)
            .text("Particulars", 50, 220)
            .text("Four Sharing", 200, 220)
            .text("Twin Sharing", 284, 220)
            .text("Single Sharing", 368, 220)
            .text("Deluxe", 450, 220)
            .text("VIP", 0, 220, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 215).lineTo(550, 215).stroke();
          //surgery particulars
          document
            .fontSize(10)
            .text("Surgery / Packages", 50, 240)
            .text(`${charges.service[0]}`, 200, 240)
            .text(`${charges.service[1]}`, 284, 240)
            .text(`${charges.service[2]}`, 368, 240)
            .text(`${charges.service[3]}`, 450, 240)
            .text(`${charges.service[4]}`, 0, 240, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 235).lineTo(550, 235).stroke();
          //room particulars
          document
            .fontSize(10)
            .text("Room", 50, 260)
            .text(`${charges.room[0]}`, 200, 260)
            .text(`${charges.room[1]}`, 284, 260)
            .text(`${charges.room[2]}`, 368, 260)
            .text(`${charges.room[3]}`, 450, 260)
            .text(`${charges.room[4]}`, 0, 260, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 255).lineTo(550, 255).stroke();

          // investigation
          document
            .fontSize(10)
            .text("Investigation", 50, 280)
            .text(`${charges.investigation[0]}`, 200, 280)
            .text(`${charges.investigation[1]}`, 284, 280)
            .text(`${charges.investigation[2]}`, 368, 280)
            .text(`${charges.investigation[3]}`, 450, 280)
            .text(`${charges.investigation[4]}`, 0, 280, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 275).lineTo(550, 275).stroke();

          // procedure
          document
            .fontSize(10)
            .text("Procedure", 50, 300)
            .text(`${charges.procedure[0]}`, 200, 300)
            .text(`${charges.procedure[1]}`, 284, 300)
            .text(`${charges.procedure[2]}`, 368, 300)
            .text(`${charges.procedure[3]}`, 450, 300)
            .text(`${charges.procedure[4]}`, 0, 300, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 295).lineTo(550, 295).stroke();

          // medicines
          document
            .fontSize(10)
            .text("Medicines", 50, 320)
            .text(`${charges.medicines[0]}`, 200, 320)
            .text(`${charges.medicines[1]}`, 284, 320)
            .text(`${charges.medicines[2]}`, 368, 320)
            .text(`${charges.medicines[3]}`, 450, 320)
            .text(`${charges.medicines[4]}`, 0, 320, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 315).lineTo(550, 315).stroke();

          // equipment
          document
            .fontSize(10)
            .text("Equipment", 50, 340)
            .text(`${charges.equipment[0]}`, 200, 340)
            .text(`${charges.equipment[1]}`, 284, 340)
            .text(`${charges.equipment[2]}`, 368, 340)
            .text(`${charges.equipment[3]}`, 450, 340)
            .text(`${charges.equipment[4]}`, 0, 340, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 335).lineTo(550, 335).stroke();

          // equipment
          document
            .fontSize(10)
            .text("Blood", 50, 360)
            .text(`${charges.blood[0]}`, 200, 360)
            .text(`${charges.blood[1]}`, 284, 360)
            .text(`${charges.blood[2]}`, 368, 360)
            .text(`${charges.blood[3]}`, 450, 360)
            .text(`${charges.blood[4]}`, 0, 360, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 355).lineTo(550, 355).stroke();

          //blood
          document
            .fontSize(10)
            .text("Other Charges", 50, 380)
            .text(`${charges.other[0]}`, 200, 380)
            .text(`${charges.other[1]}`, 284, 380)
            .text(`${charges.other[2]}`, 368, 380)
            .text(`${charges.other[3]}`, 450, 380)
            .text(`${charges.other[4]}`, 0, 380, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 375).lineTo(550, 375).stroke();

          //total
          document
            .fontSize(10)
            .text("Total", 50, 420)
            .text(`${charges.total[0]}`, 200, 420)
            .text(`${charges.total[1]}`, 284, 420)
            .text(`${charges.total[2]}`, 368, 420)
            .text(`${charges.total[3]}`, 450, 420)
            .text(`${charges.total[4]}`, 0, 420, { align: "right" });
          document.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 410).lineTo(550, 410).stroke();

          document.end();
          document.on("end", async () => {
            const file = {
              originalname: "estimate",
              buffer: Buffer.concat(buffers),
              mimeType: "application/pdf",
            };
            const { Location } = await putMedia(file, `patients/${estimate.ticket}/estimates`, BUCKET_NAME);
            await sendMessage(consumer!.phone, whatsappEstimatePayload(Location));
          });
        });
      });
  });
};

export default generateEstimate;
