import api from "./api";

export interface BuyPremiumRequest {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolderName: string;
}

export const buyPremium = async (data: BuyPremiumRequest) => {
  try {
    const response = await api.post("/Payments/buy-premium", data);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Payment failed");
  }
};
