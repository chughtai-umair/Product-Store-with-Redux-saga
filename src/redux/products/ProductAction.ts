import { Products } from "../../types";
import { ProductActionTypes } from "./ProductTypes";

export interface FetchProductsRequestAction {
  type: ProductActionTypes.FETCH_PRODUCTS_REQUEST;
}

export interface FetchProductsSuccessAction {
  type: ProductActionTypes.FETCH_PRODUCTS_SUCCESS;
  payload: Products[];
}

export interface FetchProductsFailureAction {
  type: ProductActionTypes.FETCH_PRODUCTS_FAILURE;
  payload: { error: string };
}

export type ProductAction =
  | FetchProductsRequestAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction;

export const fetchProductsRequest = (): FetchProductsRequestAction => ({
  type: ProductActionTypes.FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (
  payload: Products[]
): FetchProductsSuccessAction => ({
  type: ProductActionTypes.FETCH_PRODUCTS_SUCCESS,
  payload,
});

export const fetchProductsFailure = (payload: {
  error: string;
}): FetchProductsFailureAction => ({
  type: ProductActionTypes.FETCH_PRODUCTS_FAILURE,
  payload,
});
