export interface iWebhookPayload {
  object: string;
  entry: {
    id: string;
    changes: {
      value: {
        messaging_product: "whatsapp";
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts: {
          wa_id: string;
          profile: {
            name: string;
          };
        }[];
        errors: {
          code: number;
          title: string;
        }[];
        messages: {
          button?: { payload: any; text: string };
          interactive?: {
            type: "button_reply" | "list_reply";
            button_reply?: { id: string; title: string };
            list_reply?: { id: string; title: string; description: string };
          };
          text?: { body: string };
        }[];
        statuses: [];
      };
      field: "messages";
    }[];
  }[];
}
