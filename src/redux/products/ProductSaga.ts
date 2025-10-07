import { call, put, takeLatest } from "redux-saga/effects";
import { ProductActionTypes } from "./ProductTypes";
import { fetchProductsApi } from "../../api/ProductApi";
import { fetchProductsSuccess, fetchProductsFailure } from "./ProductAction";
import { Products } from "../../types";

// Worker saga
function* fetchProductsSaga(): Generator<any, void, any> {
  try {
    const response: Products[] = yield call(fetchProductsApi);

    // dispatch success
    yield put(fetchProductsSuccess(response));
  } catch (err: any) {
    yield put(
      fetchProductsFailure({ error: err?.message || "Fetch products failed" })
    );
  }
}

// Watcher saga
export default function* productSaga() {
  yield takeLatest(
    ProductActionTypes.FETCH_PRODUCTS_REQUEST,
    fetchProductsSaga
  );
}
