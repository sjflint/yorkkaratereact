import axios from "axios";
import {
  FINANCIAL_LIST_FAIL,
  FINANCIAL_LIST_REQUEST,
  FINANCIAL_LIST_SUCCESS,
  FINANCIAL_UPDATE_FAIL,
  FINANCIAL_UPDATE_REQUEST,
  FINANCIAL_UPDATE_SUCCESS,
  MONTHLY_COSTS_DELETE_FAIL,
  MONTHLY_COSTS_DELETE_REQUEST,
  MONTHLY_COSTS_DELETE_SUCCESS,
  MONTHLY_COSTS_LIST_FAIL,
  MONTHLY_COSTS_LIST_REQUEST,
  MONTHLY_COSTS_LIST_SUCCESS,
  MONTHLY_COSTS_UPDATE_FAIL,
  MONTHLY_COSTS_UPDATE_REQUEST,
  MONTHLY_COSTS_UPDATE_SUCCESS,
} from "../constants/financialConstants";

export const listFinancials = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCIAL_LIST_REQUEST });

    const { data } = await axios.get(`/api/financial`);

    dispatch({
      type: FINANCIAL_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCIAL_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const updateFinancials = (newFees) => async (dispatch, getState) => {
  try {
    dispatch({ type: FINANCIAL_UPDATE_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/financial`, newFees, config);

    dispatch({
      type: FINANCIAL_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FINANCIAL_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMonthlyCosts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: MONTHLY_COSTS_LIST_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/financial/monthlycosts`, config);

    dispatch({
      type: MONTHLY_COSTS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MONTHLY_COSTS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateMonthlyCosts = (update) => async (dispatch, getState) => {
  try {
    dispatch({ type: MONTHLY_COSTS_UPDATE_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/financial/monthlycosts`,
      update,
      config
    );

    dispatch({
      type: MONTHLY_COSTS_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MONTHLY_COSTS_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const deleteMonthlyCost = (_id) => async (dispatch, getState) => {
  try {
    dispatch({ type: MONTHLY_COSTS_DELETE_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    await axios.delete(`/api/financial/monthlycosts/${_id}`, config);

    dispatch({
      type: MONTHLY_COSTS_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: MONTHLY_COSTS_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
