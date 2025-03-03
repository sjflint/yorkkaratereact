import {
  TRIAL_REGISTER_FAIL,
  TRIAL_REGISTER_SUCCESS,
  TRIAL_REGISTER_REQUEST,
  TRIAL_GET_SUCCESS,
  TRIAL_GET_REQUEST,
  TRIAL_GET_FAIL,
  TRIAL_PAY_REQUEST,
  TRIAL_PAY_SUCCESS,
  TRIAL_PAY_FAIL,
  TRIAL_LIST_REQUEST,
  TRIAL_LIST_FAIL,
  TRIAL_LIST_SUCCESS,
  TRIAL_GET_RESET,
  TRIAL_REGISTER_RESET,
} from "../constants/trialRegistrationConstants";

export const trialRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case TRIAL_REGISTER_REQUEST:
      return { loading: true };
    case TRIAL_REGISTER_SUCCESS:
      return { loading: false, applicant: action.payload };
    case TRIAL_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case TRIAL_REGISTER_RESET:
      return {};
    default:
      return state;
  }
};

export const trialGetReducer = (state = {}, action) => {
  switch (action.type) {
    case TRIAL_GET_REQUEST:
      return { loading: true };
    case TRIAL_GET_SUCCESS:
      return { loading: false, applicant: action.payload };
    case TRIAL_GET_FAIL:
      return { loading: false, error: action.payload };
    case TRIAL_GET_RESET:
      return {};
    default:
      return state;
  }
};

export const trialPayReducer = (state = {}, action) => {
  switch (action.type) {
    case TRIAL_PAY_REQUEST:
      return { loading: true };
    case TRIAL_PAY_SUCCESS:
      return { loading: false, success: action.payload };
    case TRIAL_PAY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const trialListReducer = (state = {}, action) => {
  switch (action.type) {
    case TRIAL_LIST_REQUEST:
      return { loading: true };
    case TRIAL_LIST_SUCCESS:
      return { loading: false, trialMembers: action.payload };
    case TRIAL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
