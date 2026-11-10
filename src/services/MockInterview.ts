import { Streak } from "@/app/userdashboard/myinterviews/page";
import api, { getErrorDetails, JSON_HEADERS, request, requireToken } from "@/services/api";
import { Interview, MockInterviewResponse, MyInterviewsParams } from "@/types/interview";

export const startMockInterview = async (
  mode: number,
  level: number
): Promise<MockInterviewResponse> => {
  try {
    requireToken();
    const { data } = await api.post("/MockInterviews", { mode, level });
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;

    if (message.includes("Limit is reached")) {
      alert("Limit reached! Switch to premium plan.");
    }

    console.error("Mock interview error:", message);
    throw error;
  }
};

export const submitAnswer = async (
  interviewId: number,
  questionOrder: number,
  answer: string
): Promise<void> => {
  await request("Submit answer error:", () => {
    requireToken();
    // Backend body-ni JSON string kimi gözləyir
    return api.post(
      `/MockInterviews/my-interviews/${interviewId}/submit-answer`,
      JSON.stringify(answer),
      { params: { questionOrder }, headers: JSON_HEADERS }
    );
  });
};

export const getMyInterviews = async (
  params: MyInterviewsParams = { page: 1, pageSize: 10 }
): Promise<Interview[]> =>
  request<Interview[]>("Get my interviews error:", () => {
    requireToken();
    return api.get("/MockInterviews/my-interviews", {
      params: { page: params.page, pageSize: params.pageSize },
    });
  });

export const getInterviewById = async (interviewId: number): Promise<Interview> =>
  request<Interview>("Get interview by ID error:", () => {
    requireToken();
    return api.get<Interview>(`/MockInterviews/my-interviews/${interviewId}`);
  });

export const retryInterview = async (interviewId: number) => {
  try {
    const { data } = await api.post(
      `/MockInterviews/my-interviews/${interviewId}/retry`,
      null,
      { headers: JSON_HEADERS }
    );
    return data;
  } catch (error: any) {
    console.error("Retry xətası:", getErrorDetails(error));
    throw new Error(error?.message || "Retry sorğusu uğursuz oldu");
  }
};

export const getStreak = async (): Promise<Streak> => {
  requireToken();
  const { data } = await api.get("/MockInterviews/streak");
  return data;
};
