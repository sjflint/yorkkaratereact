import axios from "axios";
import {
  GRADING_DISPLAY_FAIL,
  GRADING_DISPLAY_REQUEST,
  GRADING_DISPLAY_SUCCESS,
  LIST_GRADING_RESULTS_FAIL,
  LIST_GRADING_RESULTS_REQUEST,
  LIST_GRADING_RESULTS_SUCCESS,
} from "../constants/gradingConstants";

export const listGrading = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: GRADING_DISPLAY_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/grading/${id}`, config);

    dispatch({
      type: GRADING_DISPLAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GRADING_DISPLAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const gradingResultsList = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_GRADING_RESULTS_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/grading/results/${id}`, config);

    dispatch({
      type: LIST_GRADING_RESULTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIST_GRADING_RESULTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
