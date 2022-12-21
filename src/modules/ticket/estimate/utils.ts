export const whatsappEstimatePayload = (location: string) => {
  return {
    type: "document",
    document: {
      link: location,
      filename: "Estimate",
    },
  };
};
