import { User } from "../../types/user";

const initialState: User = {
  id: -1,
  login: "",
  lastName: "",
  surName: "",
  email: "",
  account: 0,
  cardList: [],
};

export const userReducer = (
  state: User = initialState,
  action: { type: string; payload?: any },
) => {
  if (action.type === "user/login") {
    return {
      ...action.payload,
    };
  }

  if (action.type === "user/logout") {
    return {
      ...initialState,
    };
  }

  return state;
};
