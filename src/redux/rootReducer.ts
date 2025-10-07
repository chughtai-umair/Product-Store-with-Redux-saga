import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
import productReducer from "./products/ProductReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
