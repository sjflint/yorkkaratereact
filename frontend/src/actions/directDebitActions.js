import axios from "axios";
import {
  CREATE_DD_PAYMENT_FAIL,
  CREATE_DD_PAYMENT_REQUEST,
  CREATE_DD_PAYMENT_SUCCESS,
  DD_CANCEL_FAIL,
  DD_CANCEL_REQUEST,
  DD_CANCEL_SUCCESS,
  DD_UPDATE_FAIL,
  DD_UPDATE_REQUEST,
  DD_UPDATE_SUCCESS,
  UPDATE_SUBSCRIPTION_FAIL,
  UPDATE_SUBSCRIPTION_REQUEST,
  UPDATE_SUBSCRIPTION_SUCCESS,
} from "../constants/directDebitConstants";

export const directDebitUpdate = () => async (dispatch, getState) => {
  try {
    console.log("trying dd update request");
    dispatch({
      type: DD_UPDATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const _id = memberInfo._id;

    const { data } = await axios.post(`/api/members/updatedd`, { _id }, config);

    dispatch({
      type: DD_UPDATE_SUCCESS,
      payload: data,
    });

    localStorage.setItem("updateDD", JSON.stringify(data));
  } catch (error) {
    console.log("error");
    dispatch({
      type: DD_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const cancelDirectDebit = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DD_CANCEL_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const _id = memberInfo._id;

    const { data } = await axios.post(`/ddroutes/cancel`, { _id }, config);

    dispatch({
      type: DD_CANCEL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DD_CANCEL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateSubscription =
  (changeAmount) => async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_SUBSCRIPTION_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const _id = memberInfo._id;
      const paymentDetails = {
        _id: _id,
        changeAmount: changeAmount,
      };

      const { data } = await axios.post(
        `ddroutes/updatesubscription`,
        { paymentDetails },
        config
      );

      dispatch({
        type: UPDATE_SUBSCRIPTION_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_SUBSCRIPTION_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createPayment = (paymentDetails) => async (dispatch, getState) => {
  console.log(paymentDetails);
  try {
    dispatch({
      type: CREATE_DD_PAYMENT_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const _id = memberInfo._id;
    paymentDetails._id = _id;

    await axios.post(`/ddroutes/createpayment`, { paymentDetails }, config);

    dispatch({
      type: CREATE_DD_PAYMENT_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: CREATE_DD_PAYMENT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
