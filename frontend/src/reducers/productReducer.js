import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DISPLAY_REQUEST,
  PRODUCT_DISPLAY_SUCCESS,
  PRODUCT_DISPLAY_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
} from "../constants/productConstants";

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const displayProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DISPLAY_REQUEST:
      return { loading: true, ...state };
    case PRODUCT_DISPLAY_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DISPLAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_DELETE_SUCCESS:
      return { loadingProduct: false, success: true };
    case PRODUCT_DELETE_FAIL:
      return { loadingProduct: false, error: action.payload };
    default:
      return state;
  }
};

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_CREATE_SUCCESS:
      return { loadingProduct: false, success: true, event: action.payload };
    case PRODUCT_CREATE_FAIL:
      return { loadingProduct: false, error: action.payload };
    case PRODUCT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true };
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, event: action.payload };
    case PRODUCT_UPDATE_FAIL:
      return { loadingProduct: false, error: action.payload };
    case PRODUCT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
