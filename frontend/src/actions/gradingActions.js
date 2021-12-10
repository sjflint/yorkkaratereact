import axios from "axios";
import {
  GRADING_DISPLAY_FAIL,
  GRADING_DISPLAY_REQUEST,
  GRADING_DISPLAY_SUCCESS,
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
