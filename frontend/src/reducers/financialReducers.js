import {
  FINANCIAL_LIST_FAIL,
  FINANCIAL_LIST_REQUEST,
  FINANCIAL_LIST_SUCCESS,
  FINANCIAL_UPDATE_FAIL,
  FINANCIAL_UPDATE_REQUEST,
  FINANCIAL_UPDATE_SUCCESS,
  MONTHLY_COSTS_DELETE_FAIL,
  MONTHLY_COSTS_DELETE_REQUEST,
  MONTHLY_COSTS_DELETE_SUCCESS,
  MONTHLY_COSTS_LIST_FAIL,
  MONTHLY_COSTS_LIST_REQUEST,
  MONTHLY_COSTS_LIST_SUCCESS,
  MONTHLY_COSTS_UPDATE_FAIL,
  MONTHLY_COSTS_UPDATE_REQUEST,
  MONTHLY_COSTS_UPDATE_SUCCESS,
} from "../constants/financialConstants";

export const financialListReducer = (state = {}, action) => {
  switch (action.type) {
    case FINANCIAL_LIST_REQUEST:
      return { loading: true };
    case FINANCIAL_LIST_SUCCESS:
      return { loading: false, financials: action.payload };
    case FINANCIAL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const financialUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case FINANCIAL_UPDATE_REQUEST:
      return { loading: true };
    case FINANCIAL_UPDATE_SUCCESS:
      return { loading: false, success: true, financials: action.payload };
    case FINANCIAL_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const monthlyCostListReducer = (state = {}, action) => {
  switch (action.type) {
    case MONTHLY_COSTS_LIST_REQUEST:
      return { loading: true };
    case MONTHLY_COSTS_LIST_SUCCESS:
      return { loading: false, monthlyCosts: action.payload };
    case MONTHLY_COSTS_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const monthlyCostUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case MONTHLY_COSTS_UPDATE_REQUEST:
      return { loading: true };
    case MONTHLY_COSTS_UPDATE_SUCCESS:
      return { loading: false, success: true, monthlyCosts: action.payload };
    case MONTHLY_COSTS_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const monthlyCostDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case MONTHLY_COSTS_DELETE_REQUEST:
      return { loading: true };
    case MONTHLY_COSTS_DELETE_SUCCESS:
      return { loading: false, success: true };
    case MONTHLY_COSTS_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
