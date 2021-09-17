import {
  EVENT_LIST_REQUEST,
  EVENT_LIST_SUCCESS,
  EVENT_LIST_FAIL,
  EVENT_DISPLAY_REQUEST,
  EVENT_DISPLAY_SUCCESS,
  EVENT_DISPLAY_FAIL,
  EVENT_DELETE_REQUEST,
  EVENT_DELETE_SUCCESS,
  EVENT_DELETE_FAIL,
  EVENT_CREATE_REQUEST,
  EVENT_CREATE_SUCCESS,
  EVENT_CREATE_FAIL,
  EVENT_CREATE_RESET,
  EVENT_UPDATE_REQUEST,
  EVENT_UPDATE_SUCCESS,
  EVENT_UPDATE_FAIL,
  EVENT_UPDATE_RESET,
} from "../constants/eventConstants";

export const eventListReducer = (state = { events: [] }, action) => {
  switch (action.type) {
    case EVENT_LIST_REQUEST:
      return { loadingEvents: true, events: [] };
    case EVENT_LIST_SUCCESS:
      return { loadingEvents: false, events: action.payload };
    case EVENT_LIST_FAIL:
      return { loadingEvents: false, error: action.payload };
    default:
      return state;
  }
};

export const displayEventReducer = (state = { event: {} }, action) => {
  switch (action.type) {
    case EVENT_DISPLAY_REQUEST:
      return { loadingEvent: true, ...state };
    case EVENT_DISPLAY_SUCCESS:
      return { loadingEvent: false, event: action.payload };
    case EVENT_DISPLAY_FAIL:
      return { loadingEvent: false, error: action.payload };
    default:
      return state;
  }
};

export const eventDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case EVENT_DELETE_REQUEST:
      return { loading: true };
    case EVENT_DELETE_SUCCESS:
      return { loadingEvent: false, success: true };
    case EVENT_DELETE_FAIL:
      return { loadingEvent: false, error: action.payload };
    default:
      return state;
  }
};

export const eventCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case EVENT_CREATE_REQUEST:
      return { loading: true };
    case EVENT_CREATE_SUCCESS:
      return { loadingEvent: false, success: true, event: action.payload };
    case EVENT_CREATE_FAIL:
      return { loadingEvent: false, error: action.payload };
    case EVENT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const eventUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case EVENT_UPDATE_REQUEST:
      return { loading: true };
    case EVENT_UPDATE_SUCCESS:
      return { loading: false, success: true, event: action.payload };
    case EVENT_UPDATE_FAIL:
      return { loadingEvent: false, error: action.payload };
    case EVENT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
