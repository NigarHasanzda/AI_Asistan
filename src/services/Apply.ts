import api from "@/libs/api";

export const applyToInternship = async (internshipId: number) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.post(
      "/Applications/apply",
      { internshipId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Apply zamanı xəta:", error.response?.data || error.message);
    throw error;
  }
};


export const getMyApplications = async () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.get("/Applications/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("My applications error:", error.response?.data || error.message);
    throw error;
  }
};

export const getApplicationById = async (id: number) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.get(`/Applications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get application by ID error:", error.response?.data || error.message);
    throw error;
  }
};


export const withdrawApplication = async (id: number) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.delete(`/Applications/${id}/withdraw`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Withdraw error:", error.response?.data || error.message);
    throw error;
  }
};



export const addBookmark = async (internshipId: number) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.post(
      `/Bookmarks/${internshipId}`,
      {}, // body boşdur
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Bookmark əlavə edilərkən xəta:", error.response?.data || error.message);
    throw error;
  }
};

export const removeBookmark = async (internshipId: number) => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.delete(`/Bookmarks/${internshipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Bookmark silinərkən xəta:", error.response?.data || error.message);
    throw error;
  }
};

export const getBookmarks = async () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tapılmadı");

  try {
    const response = await api.get("/Bookmarks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Bookmarklar alınarkən xəta:", error.response?.data || error.message);
    throw error;
  }
};