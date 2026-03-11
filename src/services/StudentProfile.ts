import api from "@/libs/api";
import axios from "axios";



export const GetStudentProfile = async (token: string) => {
  try {
    const response = await api.get("/Students/get-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log("Get profile error:", error.response?.data);
    throw error;
  }
};