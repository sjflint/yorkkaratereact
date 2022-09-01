import axios from "axios";
import {
  SEND_EMAIL_FAIL,
  SEND_EMAIL_REQUEST,
  SEND_EMAIL_SUCCESS,
} from "../constants/emailConstatnts";

export const emailSend = (values) => async (dispatch, getState) => {
  console.log(values);
  try {
    dispatch({
      type: SEND_EMAIL_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/email`, values, config);

    dispatch({
      type: SEND_EMAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEND_EMAIL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
