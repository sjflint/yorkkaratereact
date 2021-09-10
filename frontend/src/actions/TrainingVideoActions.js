import axios from "axios";
import {
  TRAINING_VIDEO_LIST_REQUEST,
  TRAINING_VIDEO_LIST_SUCCESS,
  TRAINING_VIDEO_LIST_FAIL,
  TRAINING_VIDEO_DISPLAY_REQUEST,
  TRAINING_VIDEO_DISPLAY_SUCCESS,
  TRAINING_VIDEO_DISPLAY_FAIL,
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
