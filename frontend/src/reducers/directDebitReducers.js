import {
  CREATE_DD_PAYMENT_FAIL,
  CREATE_DD_PAYMENT_REQUEST,
  CREATE_DD_PAYMENT_RESET,
  CREATE_DD_PAYMENT_SUCCESS,
  DD_CANCEL_CLEAR,
  DD_CANCEL_FAIL,
  DD_CANCEL_REQUEST,
  DD_CANCEL_SUCCESS,
  DD_UPDATE_FAIL,
  DD_UPDATE_REQUEST,
  DD_UPDATE_SUCCESS,
  UPDATE_SUBSCRIPTION_FAIL,
  UPDATE_SUBSCRIPTION_REQUEST,
  UPDATE_SUBSCRIPTION_SUCCESS,
} from "../constants/directDebitConstants";

export const updateDirectDebitReducer = (state = {}, action) => {
  switch (action.type) {
    case DD_UPDATE_REQUEST:
      return { loading: true };
    case DD_UPDATE_SUCCESS:
      return { loading: false, ddSetupInfo: action.payload };
    case DD_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const cancelDirectDebitReducer = (state = {}, action) => {
  switch (action.type) {
    case DD_CANCEL_REQUEST:
      return { loading: true };
    case DD_CANCEL_SUCCESS:
      return { loading: false, success: action.payload };
    case DD_CANCEL_FAIL:
      return { loading: false, error: action.payload };
    case DD_CANCEL_CLEAR:
      return { loading: false, state: null };
    default:
      return state;
  }
};

export const updateSubscriptionReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_SUBSCRIPTION_REQUEST:
      return { loading: true };
    case UPDATE_SUBSCRIPTION_SUCCESS:
      return { loading: false, success: action.payload };
    case UPDATE_SUBSCRIPTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const createDDPaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_DD_PAYMENT_REQUEST:
      return { loading: true };
    case CREATE_DD_PAYMENT_SUCCESS:
      return { loading: false, success: true };
    case CREATE_DD_PAYMENT_FAIL:
      return { loading: false, error: action.payload };
    case CREATE_DD_PAYMENT_RESET:
      return {};
    default:
      return state;
  }
};
