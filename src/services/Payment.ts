import api from "./api";


export const buyPremium = async (data: {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolderName: string;
}) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/Payments/buy-premium",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // artıq success response
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Payment failed");
  }
};