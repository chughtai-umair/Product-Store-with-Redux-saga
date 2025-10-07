import { AuthAction } from "./authActions";
import { AuthActionTypes } from "./authTypes";

export type AuthState = {
  loading: boolean;
  token: string | null;
  error: string | null;
};

const initialState: AuthState = {
  loading: false,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  error: null,
};

export default function authReducer(
  state: AuthState = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case AuthActionTypes.LOGIN_SUCCESS:
      return { ...state, loading: false, token: action.payload.token };

    case AuthActionTypes.LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload.error };

    case AuthActionTypes.LOGOUT:
      return { ...state, token: null };

    default:
      return state;
  }
}
