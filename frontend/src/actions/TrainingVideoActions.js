import axios from "axios";
import {
  TRAINING_VIDEO_LIST_REQUEST,
  TRAINING_VIDEO_LIST_SUCCESS,
  TRAINING_VIDEO_LIST_FAIL,
  TRAINING_VIDEO_DISPLAY_REQUEST,
  TRAINING_VIDEO_DISPLAY_SUCCESS,
  TRAINING_VIDEO_DISPLAY_FAIL,
  TRAINING_VIDEO_DELETE_REQUEST,
  TRAINING_VIDEO_DELETE_SUCCESS,
  TRAINING_VIDEO_DELETE_FAIL,
  TRAINING_VIDEO_CREATE_REQUEST,
  TRAINING_VIDEO_CREATE_SUCCESS,
  TRAINING_VIDEO_CREATE_FAIL,
  TRAINING_VIDEO_UPDATE_REQUEST,
  TRAINING_VIDEO_UPDATE_SUCCESS,
  TRAINING_VIDEO_UPDATE_FAIL,
} from "../constants/trainingVideoConstants";

export const listTrainingVideos = () => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_VIDEO_LIST_REQUEST });

    const { data } = await axios.get("/api/trainingvideos");

    dispatch({
      type: TRAINING_VIDEO_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_VIDEO_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listTrainingVideo = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRAINING_VIDEO_DISPLAY_REQUEST });

    const { data } = await axios.get(`/api/trainingvideos/${id}`);

    dispatch({
      type: TRAINING_VIDEO_DISPLAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_VIDEO_DISPLAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteTrainingVideo = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRAINING_VIDEO_DELETE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    await axios.delete(`/api/trainingVideos/${id}`, config);

    dispatch({
      type: TRAINING_VIDEO_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_VIDEO_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createTrainingVideo = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRAINING_VIDEO_CREATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/trainingvideos`, values, config);

    dispatch({
      type: TRAINING_VIDEO_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_VIDEO_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateTrainingVideo = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRAINING_VIDEO_UPDATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/trainingvideos/:id`, values, config);

    dispatch({
      type: TRAINING_VIDEO_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRAINING_VIDEO_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
