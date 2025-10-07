import { AuthActionTypes } from "./authTypes";
import { UserCredentials } from "../../types";

export interface LoginRequestAction {
  type: AuthActionTypes.LOGIN_REQUEST;
  payload: UserCredentials;
}

export interface LoginSuccessAction {
  type: AuthActionTypes.LOGIN_SUCCESS;
  payload: { token: string };
}

export interface LoginFailureAction {
  type: AuthActionTypes.LOGIN_FAILURE;
  payload: { error: string };
}

export interface LogoutAction {
  type: AuthActionTypes.LOGOUT;
}

export type AuthAction =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction;

export const loginRequest = (payload: UserCredentials): LoginRequestAction => ({
  type: AuthActionTypes.LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (payload: {
  token: string;
}): LoginSuccessAction => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload: {
  error: string;
}): LoginFailureAction => ({
  type: AuthActionTypes.LOGIN_FAILURE,
  payload,
});

export const logout = (): LogoutAction => ({ type: AuthActionTypes.LOGOUT });
