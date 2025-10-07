import { all } from "redux-saga/effects";
import authSaga from "./auth/authSaga";
import productSaga from "./products/ProductSaga";

export default function* rootSaga() {
  yield all([authSaga(), productSaga()]);
}
