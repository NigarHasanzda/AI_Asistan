import api from "@/libs/api";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/forgotpassword";

// Forgot Password
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  try {
    const response = await api.post<ForgotPasswordResponse>(
      "/Auth/forgot-password",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Email göndərərkən xəta baş verdi");
    } else {
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};

// Reset Password
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  try {
    const response = await api.post<ResetPasswordResponse>(
      "/Auth/reset-password",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Şifrə yeniləyərkən xəta baş verdi");
    } else {
      throw new Error(error.message || "Serverə qoşulmaq mümkün olmadı");
    }
  }
};