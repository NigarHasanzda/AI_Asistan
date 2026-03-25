import api from "@/libs/api";
import { MockInterviewResponse, MyInterviewsParams } from "@/types/interview";

// --- START MOCK INTERVIEW ---
export const startMockInterview = async (mode: number, level: number): Promise<MockInterviewResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tapılmadı");

    const response = await api.post(
      "/MockInterviews",
      { mode, level },
      { headers: { Authorization: `Bearer ${token}` } }

      
    );

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;

    if (message.includes("Limit is reached")) {
      alert("Limit reached! Switch to premium plan.");
    }

    console.error("Mock interview error:", message);
    throw error;
  }
};

export const startPracticeInterview = async (interviewId: number): Promise<MockInterviewResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tapılmadı");

    const response = await api.get(
      `/MockInterviews/my-interviews/${interviewId}`,
      { headers: { Authorization: `Bearer ${token}` } } // token lazım ola bilər
    );

    // 🔹 Burada tam response-u qaytarırıq
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;

    if (message.includes("Limit is reached")) {
      alert("Limit reached! Switch to premium plan.");
    }

    console.error("Practice interview error:", message);
    throw error;
  }
};


// --- SUBMIT ANSWER ---
export const submitAnswer = async (
  interviewId: number,
  questionOrder: number,
  answer: string
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tapılmadı");

    await api.post(
      `/MockInterviews/my-interviews/${interviewId}/submit-answer?questionOrder=${questionOrder}`,
      `"${answer}"`, // 🔹 Sadəcə JSON string kimi göndərilir
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // mütləq
        },
      }
    );
  } catch (error: any) {
    console.error("Submit answer error:", error.response?.data || error.message);
    throw error;
  }
};

export const getMyInterviews = async (
  params: MyInterviewsParams = { page: 1, pageSize: 10 }
): Promise<MockInterviewResponse[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tapılmadı");

    const response = await api.get("/MockInterviews/my-interviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get my interviews error:", error.response?.data || error.message);
    throw error;
  }
};


// --- GET INTERVIEW BY ID ---
export const getInterviewById = async (interviewId: number): Promise<MockInterviewResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tapılmadı");

    const response = await api.get(
      `/MockInterviews/my-interviews/${interviewId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Get interview by ID error:", message);
    throw error;
  }
};




export const retryInterview = async (interviewId: number) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/MockInterviews/my-interviews/${interviewId}/retry`,
      null, // POST body is empty
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // serverdən gələn yeni interview məlumatı
  } catch (error: any) {
    console.error("Retry xətası:", error);
    throw new Error(error?.message || "Retry sorğusu uğursuz oldu");
  }
};

export const getStreak = async (): Promise<number | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tapılmadı");

    const response = await api.get("/MockInterviews/streak", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Əgər server sadəcə streak sayını qaytarırsa:
    return response.data; 
  } catch (err: any) {
    console.error("Streak gətirilərkən xəta baş verdi:", err);
    return null;
  }
};