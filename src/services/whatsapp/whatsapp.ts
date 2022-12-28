import axios from "axios";
const { WA_ACCOUNT_ID, WA_TOKEN } = process.env;

const WHATSAPP_URL = `https://graph.facebook.com/v15.0/${WA_ACCOUNT_ID}/messages`;

export const sendMessage = async (receiver: string, payload: any) => {
  return await axios.post(
    WHATSAPP_URL,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${receiver}`,
      ...payload,
    },
    {
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const sendTemplateMessage = async (
  receiver: string,
  templateName: string,
  templateLanguage: string
) => {
  return await axios.post(
    WHATSAPP_URL,
    {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${receiver}`,
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
};
