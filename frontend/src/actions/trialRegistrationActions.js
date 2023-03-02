import axios from "axios";
import {
  TRIAL_GET_FAIL,
  TRIAL_GET_REQUEST,
  TRIAL_GET_SUCCESS,
  TRIAL_LIST_FAIL,
  TRIAL_LIST_REQUEST,
  TRIAL_LIST_SUCCESS,
  TRIAL_PAY_FAIL,
  TRIAL_PAY_REQUEST,
  TRIAL_PAY_SUCCESS,
  TRIAL_REGISTER_FAIL,
  TRIAL_REGISTER_REQUEST,
  TRIAL_REGISTER_SUCCESS,
} from "../constants/trialRegistrationConstants";

export const registerTrial = (values) => async (dispatch) => {
  try {
    dispatch({
      type: TRIAL_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/trialregistration", values, config);

    dispatch({
      type: TRIAL_REGISTER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRIAL_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getTrial = (id) => async (dispatch) => {
  try {
    dispatch({
      type: TRIAL_GET_REQUEST,
    });

    const { data } = await axios.get(`/api/trialregistration/${id}`);

    dispatch({
      type: TRIAL_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRIAL_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getTrialList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: TRIAL_LIST_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/trialregistration", config);

    dispatch({
      type: TRIAL_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRIAL_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const payTrial = (id) => async (dispatch) => {
  try {
    dispatch({
      type: TRIAL_PAY_REQUEST,
    });

    const { data } = await axios.put(`/api/trialregistration/${id}`);

    dispatch({
      type: TRIAL_PAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRIAL_PAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
