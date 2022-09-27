import axios from "axios";
import {
  ENQUIRY_LIST_FAIL,
  ENQUIRY_LIST_REQUEST,
  ENQUIRY_LIST_SUCCESS,
} from "../constants/enquiryConstants";

export const listEnquiries = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ENQUIRY_LIST_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/enquiry`, config);

    dispatch({
      type: ENQUIRY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ENQUIRY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
