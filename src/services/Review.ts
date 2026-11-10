import api from "./api";

export const createReview = async (message: string) => {
  const { data } = await api.post("/Reviews", { message });
  return data;
};

export const getMyReviews = async () => {
  const { data } = await api.get("/Reviews/my");
  return data;
};

export const deleteReview = async (id: number) => {
  const { data } = await api.delete(`/Reviews/${id}`);
  return data;
};
