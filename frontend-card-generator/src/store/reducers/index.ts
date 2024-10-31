import { combineReducers } from "redux";
import { userReducer } from "./user.reducer";
import inventoryReducer from "./inventory.reducer";

const globalReducer = combineReducers({
  userReducer: userReducer,
  inventoryReducer: inventoryReducer,
});

export default globalReducer;
