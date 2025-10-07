import { call, put, takeLatest } from "redux-saga/effects";
import { AuthActionTypes } from "./authTypes";
import { loginApi } from "../../api/authApi";
import { loginSuccess, loginFailure, LoginRequestAction } from "./authActions";

// Worker saga
function* loginSaga(action: LoginRequestAction): Generator<any, any, any> {
  try {
    const response = (yield call(loginApi, action.payload)) as {
      token: string;
    };

    // persist token
    localStorage.setItem("token", response.token);

    // dispatch success
    yield put(loginSuccess({ token: response.token }));
  } catch (err: any) {
    yield put(loginFailure({ error: err?.message || "Login failed" }));
  }
}

// Watcher saga
export default function* authSaga() {
  yield takeLatest(AuthActionTypes.LOGIN_REQUEST, loginSaga);
}
