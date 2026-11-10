"use client";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const API_HOST = "https://khalida06-002-site1.htempurl.com";
const TOKEN_KEY = "token";

const api = axios.create({
  baseURL: `${API_HOST}/api`,
});

// ---------- Token helpers ----------

export const isBrowser = (): boolean => typeof window !== "undefined";

/** localStorage-dakı token (server tərəfində və ya yoxdursa null). */
export const getToken = (): string | null =>
  isBrowser() ? localStorage.getItem(TOKEN_KEY) : null;

/** Token yoxdursa "Token tapılmadı" xətası atır. */
export const requireToken = (): string => {
  const token = getToken();
  if (!token) throw new Error("Token tapılmadı");
  return token;
};

/** Konkret token ilə Authorization header-i qurur. */
export const withAuth = (
  token: string | null,
  config: AxiosRequestConfig = {}
): AxiosRequestConfig => ({
  ...config,
  headers: { ...config.headers, Authorization: `Bearer ${token}` },
});

export const JSON_HEADERS = { "Content-Type": "application/json" };
export const MULTIPART_HEADERS = { "Content-Type": "multipart/form-data" };

// Hər sorğuya localStorage-dakı ən son token əlavə olunur.
// Funksiya öz token-ini ötürübsə (withAuth), ona toxunulmur.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Error helpers ----------

/** Serverin xəta cavabı, yoxdursa xəta mesajı. */
export const getErrorDetails = (error: any) =>
  error?.response?.data || error?.message;

/** Xətanı oxunaqlı formatda log edir (Next.js overlay obyektləri {} göstərir). */
export const logApiError = (label: string, error: any): void => {
  console.error(
    `${label} status=${error?.response?.status} message=${error?.message} data=${JSON.stringify(
      error?.response?.data
    )}`
  );
};

/**
 * Sorğunu icra edir və `response.data` qaytarır.
 * Xəta olarsa, `label` ilə log edir və xətanı olduğu kimi yenidən atır.
 */
export const request = async <T = any>(
  label: string,
  call: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  try {
    const { data } = await call();
    return data;
  } catch (error) {
    logApiError(label, error);
    throw error;
  }
};

export default api;
