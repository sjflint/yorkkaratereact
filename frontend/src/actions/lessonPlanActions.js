import axios from "axios";
import {
  LESSON_PLAN_CREATE_FAIL,
  LESSON_PLAN_CREATE_REQUEST,
  LESSON_PLAN_CREATE_SUCCESS,
  LESSON_PLAN_DELETE_FAIL,
  LESSON_PLAN_DELETE_REQUEST,
  LESSON_PLAN_DELETE_SUCCESS,
  LESSON_PLAN_DISPLAY_FAIL,
  LESSON_PLAN_DISPLAY_REQUEST,
  LESSON_PLAN_DISPLAY_SUCCESS,
  LESSON_PLAN_LIST_FAIL,
  LESSON_PLAN_LIST_REQUEST,
  LESSON_PLAN_LIST_SUCCESS,
  LESSON_PLAN_UPDATE_FAIL,
  LESSON_PLAN_UPDATE_REQUEST,
  LESSON_PLAN_UPDATE_SUCCESS,
} from "../constants/lessonPlanConstants";

export const listLessonPlans = () => async (dispatch) => {
  try {
    dispatch({ type: LESSON_PLAN_LIST_REQUEST });

    const { data } = await axios.get("/api/lessonplans");

    dispatch({
      type: LESSON_PLAN_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LESSON_PLAN_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listLessonPlan = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: LESSON_PLAN_DISPLAY_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/lessonplans/${id}`, config);

    dispatch({
      type: LESSON_PLAN_DISPLAY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LESSON_PLAN_DISPLAY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteLessonPlan = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: LESSON_PLAN_DELETE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    await axios.delete(`/api/lessonplans/${id}`, config);

    dispatch({
      type: LESSON_PLAN_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: LESSON_PLAN_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createLessonPlan = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: LESSON_PLAN_CREATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/lessonplans`, values, config);

    dispatch({
      type: LESSON_PLAN_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LESSON_PLAN_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateLessonPlan = (values) => async (dispatch, getState) => {
  try {
    dispatch({
      type: LESSON_PLAN_UPDATE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/lessonplans/:id`, values, config);

    dispatch({
      type: LESSON_PLAN_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LESSON_PLAN_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
