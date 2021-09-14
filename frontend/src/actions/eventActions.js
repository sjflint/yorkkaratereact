import axios from "axios";
import {
  EVENT_LIST_REQUEST,
  EVENT_LIST_SUCCESS,
  EVENT_LIST_FAIL,
  EVENT_DISPLAY_REQUEST,
  EVENT_DISPLAY_SUCCESS,
  EVENT_DISPLAY_FAIL,
  EVENT_DELETE_REQUEST,
  EVENT_DELETE_SUCCESS,
  EVENT_DELETE_FAIL,
  EVENT_CREATE_REQUEST,
  EVENT_CREATE_SUCCESS,
  EVENT_CREATE_FAIL,
} from "../constants/eventConstants";

export const listEvents = () => async (dispatch) => {
  try {
    dispatch({ type: EVENT_LIST_REQUEST });

    const { data } = await axios.get("/api/events");

    dispatch({
      type: EVENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EVENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: EVENT_DISPLAY_REQUEST });

    const { data } = await axios.get(`/api/events/${id}`);

    dispatch({
      type: EVENT_DISPLAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EVENT_DISPLAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteEvent = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EVENT_DELETE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    await axios.delete(`/api/events/${id}`, config);

    dispatch({
      type: EVENT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: EVENT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createEvent = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EVENT_CREATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/events`, values, config);

    dispatch({
      type: EVENT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: EVENT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
