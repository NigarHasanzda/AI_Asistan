import api from "../api";

export const getAdminReviews = async (page = 1, pageSize = 10) => {
  const { data } = await api.get("/Admin/reviews", { params: { page, pageSize } });
  return data;
};

export const respondToReview = async (reviewId: number, responseMessage: string) => {
  const { data } = await api.post("/Admin/reviews/respond", {
    reviewId,
    response: responseMessage,
  });
  return data;
};
