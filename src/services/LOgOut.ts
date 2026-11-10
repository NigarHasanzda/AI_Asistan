import { getToken } from "@/services/api";
import { logout } from "@/utils/logout";

/** Token yoxdursa logout edib login səhifəsinə yönləndirir. */
export const checkToken = (): boolean => {
  if (getToken()) return true;

  logout();
  return false;
};
