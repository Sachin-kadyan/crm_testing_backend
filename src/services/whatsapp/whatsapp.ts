import axios from "axios";
import ErrorHandler from "../../utils/errorHandler";
const { WA_ACCOUNT_ID, WA_TOKEN } = process.env;

const WHATSAPP_URL = `https://graph.facebook.com/v15.0/${WA_ACCOUNT_ID}/messages`;
export const sendMessage = async (receiver: string, payload: any) => {
  try {
    const { data } = await axios.post(
      WHATSAPP_URL,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: receiver,
        ...payload,
      },
      {
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new ErrorHandler(error.response.data.error.message, 500);
  }
};

export const sendTemplateMessage = async (
  receiver: string,
  templateName: string,
  templateLanguage: string
) => {
  try {
    const { data } = await axios.post(
      WHATSAPP_URL,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: receiver,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: templateLanguage,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new ErrorHandler(error.response.data.error.message, 500);
  }
};
