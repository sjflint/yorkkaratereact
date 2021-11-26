import {
  LESSON_PLAN_CREATE_FAIL,
  LESSON_PLAN_CREATE_REQUEST,
  LESSON_PLAN_CREATE_RESET,
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
  LESSON_PLAN_UPDATE_RESET,
  LESSON_PLAN_UPDATE_SUCCESS,
} from "../constants/lessonPlanConstants";

export const lessonPlanListReducer = (state = { lessonPlans: [] }, action) => {
  switch (action.type) {
    case LESSON_PLAN_LIST_REQUEST:
      return { loadingLessonPlans: true, lessonPlans: [] };
    case LESSON_PLAN_LIST_SUCCESS:
      return { loadingLessonPlans: false, lessonPlans: action.payload };
    case LESSON_PLAN_LIST_FAIL:
      return { loadingLessonPlans: false, error: action.payload };
    default:
      return state;
  }
};

export const displayLessonPlanReducer = (
  state = { lessonPlan: {} },
  action
) => {
  switch (action.type) {
    case LESSON_PLAN_DISPLAY_REQUEST:
      return { loadingLessonPlan: true, ...state };
    case LESSON_PLAN_DISPLAY_SUCCESS:
      return { loadingLessonPlan: false, lessonPlan: action.payload };
    case LESSON_PLAN_DISPLAY_FAIL:
      return { loadingLessonPlan: false, error: action.payload };
    default:
      return state;
  }
};

export const lessonPlanDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case LESSON_PLAN_DELETE_REQUEST:
      return { loading: true };
    case LESSON_PLAN_DELETE_SUCCESS:
      return { loadingLessonPlan: false, success: true };
    case LESSON_PLAN_DELETE_FAIL:
      return { loadingLessonPlan: false, error: action.payload };
    default:
      return state;
  }
};

export const lessonPlanCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case LESSON_PLAN_CREATE_REQUEST:
      return { loading: true };
    case LESSON_PLAN_CREATE_SUCCESS:
      return {
        loadingLessonPlan: false,
        success: true,
        lessonPlan: action.payload,
      };
    case LESSON_PLAN_CREATE_FAIL:
      return { loadingLessonPlan: false, error: action.payload };
    case LESSON_PLAN_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const lessonPlanUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case LESSON_PLAN_UPDATE_REQUEST:
      return { loading: true };
    case LESSON_PLAN_UPDATE_SUCCESS:
      return { loading: false, success: true, lessonPlan: action.payload };
    case LESSON_PLAN_UPDATE_FAIL:
      return { loadingLessonPlan: false, error: action.payload };
    case LESSON_PLAN_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
