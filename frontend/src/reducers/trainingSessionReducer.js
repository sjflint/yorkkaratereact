import {
  TRAINING_SESSION_REQUEST,
  TRAINING_SESSION_SUCCESS,
  TRAINING_SESSION_FAIL,
  MY_CLASS_LIST_REQUEST,
  MY_CLASS_LIST_SUCCESS,
  MY_CLASS_LIST_FAIL,
  ADD_CLASS_LIST_REQUEST,
  ADD_CLASS_LIST_SUCCESS,
  ADD_CLASS_LIST_FAIL,
  DELETE_CLASS_LIST_REQUEST,
  DELETE_CLASS_LIST_SUCCESS,
  DELETE_CLASS_LIST_FAIL,
  SWITCH_CLASS_LIST_REQUEST,
  SWITCH_CLASS_LIST_SUCCESS,
  SWITCH_CLASS_LIST_FAIL,
  MEMBER_CLASS_LIST_REQUEST,
  MEMBER_CLASS_LIST_SUCCESS,
  MEMBER_CLASS_LIST_FAIL,
  TRAINING_SESSION_DELETE_REQUEST,
  TRAINING_SESSION_DELETE_SUCCESS,
  TRAINING_SESSION_DELETE_FAIL,
  TRAINING_SESSION_CREATE_REQUEST,
  TRAINING_SESSION_CREATE_SUCCESS,
  TRAINING_SESSION_CREATE_FAIL,
  TRAINING_SESSION_CREATE_RESET,
  TRAINING_SESSION_UPDATE_REQUEST,
  TRAINING_SESSION_UPDATE_SUCCESS,
  TRAINING_SESSION_UPDATE_FAIL,
  TRAINING_SESSION_UPDATE_RESET,
  TRAINING_SESSION_ID_REQUEST,
  TRAINING_SESSION_ID_SUCCESS,
  TRAINING_SESSION_ID_FAIL,
  TRAINING_SESSION_CANCEL_REQUEST,
  TRAINING_SESSION_CANCEL_SUCCESS,
  TRAINING_SESSION_CANCEL_FAIL,
  TRAINING_SESSION_CANCEL_RESET,
  WAITING_LIST_REQUEST,
  WAITING_LIST_SUCCESS,
  WAITING_LIST_FAIL,
  WAITING_LIST_RESET,
} from "../constants/trainingSessionConstants";

export const listTrainingSessionsReducer = (
  state = { trainingSessions: [] },
  action
) => {
  switch (action.type) {
    case TRAINING_SESSION_REQUEST:
      return { loading: true, trainingSessions: [] };
    case TRAINING_SESSION_SUCCESS:
      return { loading: false, trainingSessions: action.payload };
    case TRAINING_SESSION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const trainingSessionByIdReducer = (
  state = { trainingSession: [] },
  action
) => {
  switch (action.type) {
    case TRAINING_SESSION_ID_REQUEST:
      return { loading: true };
    case TRAINING_SESSION_ID_SUCCESS:
      return { loading: false, trainingSession: action.payload };
    case TRAINING_SESSION_ID_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const myClassListReducer = (state = { sessions: [] }, action) => {
  switch (action.type) {
    case MY_CLASS_LIST_REQUEST:
      return {
        loading: true,
      };
    case MY_CLASS_LIST_SUCCESS:
      return {
        loading: false,
        sessions: action.payload,
      };
    case MY_CLASS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const memberClassListReducer = (state = { sessions: [] }, action) => {
  switch (action.type) {
    case MEMBER_CLASS_LIST_REQUEST:
      return {
        loading: true,
      };
    case MEMBER_CLASS_LIST_SUCCESS:
      return {
        loading: false,
        sessions: action.payload,
      };
    case MEMBER_CLASS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const AddClassListReducer = (state = { id: [] }, action) => {
  switch (action.type) {
    case ADD_CLASS_LIST_REQUEST:
      return {
        loading: true,
      };
    case ADD_CLASS_LIST_SUCCESS:
      return {
        loading: false,
        id: action.payload,
      };
    case ADD_CLASS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const deleteClassListReducer = (state = { id: [] }, action) => {
  switch (action.type) {
    case DELETE_CLASS_LIST_REQUEST:
      return {
        loading: true,
      };
    case DELETE_CLASS_LIST_SUCCESS:
      return {
        loading: false,
        id: action.payload,
      };
    case DELETE_CLASS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const switchClassListReducer = (state = { id: [] }, action) => {
  switch (action.type) {
    case SWITCH_CLASS_LIST_REQUEST:
      return {
        loading: true,
      };
    case SWITCH_CLASS_LIST_SUCCESS:
      return {
        loading: false,
        id: action.payload,
      };
    case SWITCH_CLASS_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const trainingSessionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_SESSION_DELETE_REQUEST:
      return { loading: true };
    case TRAINING_SESSION_DELETE_SUCCESS:
      return { loadingTrainingSession: false, success: true };
    case TRAINING_SESSION_DELETE_FAIL:
      return { loadingTrainingSession: false, error: action.payload };
    default:
      return state;
  }
};

export const trainingSessionCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_SESSION_CREATE_REQUEST:
      return { loading: true };
    case TRAINING_SESSION_CREATE_SUCCESS:
      return {
        loadingTrainingSession: false,
        success: true,
        trainingSession: action.payload,
      };
    case TRAINING_SESSION_CREATE_FAIL:
      return { loadingTrainingSession: false, error: action.payload };
    case TRAINING_SESSION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const trainingSessionUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_SESSION_UPDATE_REQUEST:
      return { loading: true };
    case TRAINING_SESSION_UPDATE_SUCCESS:
      return { loading: false, success: true, trainingSession: action.payload };
    case TRAINING_SESSION_UPDATE_FAIL:
      return { loadingTrainingSession: false, error: action.payload };
    case TRAINING_SESSION_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const trainingSessionCancelReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_SESSION_CANCEL_REQUEST:
      return { loading: true };
    case TRAINING_SESSION_CANCEL_SUCCESS:
      return { loading: false, success: true };
    case TRAINING_SESSION_CANCEL_FAIL:
      return { loadingTrainingSession: false, error: action.payload };
    case TRAINING_SESSION_CANCEL_RESET:
      return {};
    default:
      return state;
  }
};

export const waitingListReducer = (state = {}, action) => {
  switch (action.type) {
    case WAITING_LIST_REQUEST:
      return { loading: true };
    case WAITING_LIST_SUCCESS:
      return { loading: false, success: true, details: action.payload };
    case WAITING_LIST_FAIL:
      return { loading: false, error: action.payload };
    case WAITING_LIST_RESET:
      return {};
    default:
      return state;
  }
};
