import axios from "axios";
const { WA_ACCOUNT_ID, WA_TOKEN } = process.env;

export const sendMessage = async (receiver: string, payload: any) => {
  await axios.post(
    `https://graph.facebook.com/v15.0/${WA_ACCOUNT_ID}/messages`,
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
