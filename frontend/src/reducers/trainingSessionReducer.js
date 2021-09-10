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
} from "../constants/trainingSessionConstants";

export const trainingSessionReducer = (
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
