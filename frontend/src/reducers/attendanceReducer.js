import {
  ATTENDANCE_LIST_REQUEST,
  ATTENDANCE_LIST_SUCCESS,
  ATTENDANCE_LIST_FAIL,
  ATTENDANCE_REMOVE_REQUEST,
  ATTENDANCE_REMOVE_SUCCESS,
  ATTENDANCE_REMOVE_FAIL,
  ATTENDANCE_ADD_REQUEST,
  ATTENDANCE_ADD_SUCCESS,
  ATTENDANCE_ADD_FAIL,
  ATTENDANCE_ADD_EXTRA_REQUEST,
  ATTENDANCE_ADD_EXTRA_SUCCESS,
  ATTENDANCE_ADD_EXTRA_FAIL,
} from "../constants/attendanceConstants";

export const attendanceListReducer = (state = {}, action) => {
  switch (action.type) {
    case ATTENDANCE_LIST_REQUEST:
      return { loading: true, record: [] };
    case ATTENDANCE_LIST_SUCCESS:
      return {
        loading: false,
        record: action.payload,
      };
    case ATTENDANCE_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const removeAttendeeReducer = (state = {}, action) => {
  switch (action.type) {
    case ATTENDANCE_REMOVE_REQUEST:
      return { loading: true };
    case ATTENDANCE_REMOVE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ATTENDANCE_REMOVE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addAttendeeReducer = (state = {}, action) => {
  switch (action.type) {
    case ATTENDANCE_ADD_REQUEST:
      return { loading: true };
    case ATTENDANCE_ADD_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ATTENDANCE_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addExtraAttendeeReducer = (state = {}, action) => {
  switch (action.type) {
    case ATTENDANCE_ADD_EXTRA_REQUEST:
      return { loading: true };
    case ATTENDANCE_ADD_EXTRA_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ATTENDANCE_ADD_EXTRA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
