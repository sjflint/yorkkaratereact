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
  TRAINING_SESSION_DELETE_REQUEST,
  TRAINING_SESSION_DELETE_SUCCESS,
  TRAINING_SESSION_DELETE_FAIL,
  TRAINING_SESSION_CREATE_REQUEST,
  TRAINING_SESSION_CREATE_SUCCESS,
  TRAINING_SESSION_CREATE_FAIL,
  TRAINING_SESSION_UPDATE_REQUEST,
  TRAINING_SESSION_UPDATE_SUCCESS,
  TRAINING_SESSION_UPDATE_FAIL,
  TRAINING_SESSION_ID_REQUEST,
  TRAINING_SESSION_ID_SUCCESS,
  TRAINING_SESSION_ID_FAIL,
  TRAINING_SESSION_CANCEL_REQUEST,
  TRAINING_SESSION_CANCEL_SUCCESS,
  TRAINING_SESSION_CANCEL_FAIL,
  WAITING_LIST_REQUEST,
  WAITING_LIST_SUCCESS,
  WAITING_LIST_FAIL,
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

export const trainingSessionById = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_SESSION_ID_REQUEST });

    const { data } = await axios.get(`/api/trainingSessions/${id}`);

    dispatch({
      type: TRAINING_SESSION_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_SESSION_ID_FAIL,
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

export const deleteTrainingSession = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRAINING_SESSION_DELETE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    await axios.delete(`/api/trainingsessions/${id}`, config);

    dispatch({
      type: TRAINING_SESSION_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_SESSION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createTrainingSession = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRAINING_SESSION_CREATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/trainingSessions`, values, config);

    dispatch({
      type: TRAINING_SESSION_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_SESSION_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateTrainingSession = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRAINING_SESSION_UPDATE_REQUEST,
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
      `/api/trainingsessions/:id`,
      values,
      config
    );

    dispatch({
      type: TRAINING_SESSION_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_SESSION_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const cancelTrainingSession =
  (classId, date) => async (dispatch, getState) => {
    const values = { classId, date };
    try {
      dispatch({
        type: TRAINING_SESSION_CANCEL_REQUEST,
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
        `/api/trainingsessions/:id`,
        values,
        config
      );

      dispatch({
        type: TRAINING_SESSION_CANCEL_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: TRAINING_SESSION_CANCEL_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const addToWaitingList = (details) => async (dispatch, getState) => {
  try {
    dispatch({
      type: WAITING_LIST_REQUEST,
    });

    const { data } = await axios.post(
      `/api/trainingsessions/waitinglist`,
      details
    );

    dispatch({
      type: WAITING_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WAITING_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
