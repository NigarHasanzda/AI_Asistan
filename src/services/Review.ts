import api from "./api";

// 🔹 Create review
export const createReview = async (message: string) => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const response = await api.post(
    "/Reviews",
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// 🔹 Get my reviews
export const getMyReviews = async () => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const response = await api.get("/Reviews/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🔹 Delete review
export const deleteReview = async (id: number) => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const response = await api.delete(`/Reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};