// utils/logout.ts
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "/login"; // login səhifəsinə yönləndir
};