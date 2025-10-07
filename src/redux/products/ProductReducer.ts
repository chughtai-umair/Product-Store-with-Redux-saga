import { Products } from "../../types";
import { ProductAction } from "./ProductAction";
import { ProductActionTypes } from "./ProductTypes";

interface ProductState {
  loading: boolean;
  products: Products[];
  error: string | null;
}

const initialState: ProductState = {
  loading: false,
  products: [],
  error: null,
};

export default function productReducer(
  state: ProductState = initialState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    case ProductActionTypes.FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case ProductActionTypes.FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload };
    case ProductActionTypes.FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
}
