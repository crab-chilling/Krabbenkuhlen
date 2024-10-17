import { User } from "../../types/user";

export const loginAction = (user: User) => ({
  type: "user/login",
  payload: user,
});

export const logoutAction = () => ({
  type: "user/logout",
});
