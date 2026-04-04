import api from "../api";

// 🔹 GET Admin Reviews (pagination ilə)
export const getAdminReviews = async (page = 1, pageSize = 10) => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const response = await api.get("/Admin/reviews", {
    params: { page, pageSize },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 POST Respond to Review
export const respondToReview = async (
  reviewId: number,
  responseMessage: string
) => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const response = await api.post(
    "/Admin/reviews/respond",
    {
      reviewId,
      response: responseMessage,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};