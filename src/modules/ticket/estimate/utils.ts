export const whatsappEstimatePayload = (location: string) => {
  return [
    {
      type: "header",
      parameters: [
        {
          type: "document",
          document: {
            link: location,
          },
        },
      ],
    },
  ];
};
