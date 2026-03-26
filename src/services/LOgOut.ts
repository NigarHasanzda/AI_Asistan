import { logout } from "@/utils/logout";


export const checkToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    logout(); // token yoxdursa logout et və login-ə yönləndir
    return false;
  }
  return true;
};

