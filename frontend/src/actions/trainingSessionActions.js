import axios from "axios";
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

export const listTrainingSessions = () => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_SESSION_REQUEST });

    const { data } = await axios.get("/api/trainingSessions");

    dispatch({
      type: TRAINING_SESSION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_SESSION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMyClasses = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: MY_CLASS_LIST_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `/api/trainingSessions/myTrainingSessions`,
      config
    );

    dispatch({
      type: MY_CLASS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMemberClasses = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MEMBER_CLASS_LIST_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `/api/trainingsessions/membertrainingsessions/${id}`,
      config
    );

    dispatch({
      type: MEMBER_CLASS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEMBER_CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addMyClass = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ADD_CLASS_LIST_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/trainingSessions/addsession`,
      id,
      config
    );

    dispatch({
      type: ADD_CLASS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteMyClass = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_CLASS_LIST_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/trainingsessions/deletesession`,
      id,
      config
    );

    dispatch({
      type: DELETE_CLASS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const switchMyClass = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SWITCH_CLASS_LIST_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/trainingsessions/switchsession`,
      id,
      config
    );

    dispatch({
      type: SWITCH_CLASS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SWITCH_CLASS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
