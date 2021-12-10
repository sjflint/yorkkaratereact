import {
  GRADING_DISPLAY_FAIL,
  GRADING_DISPLAY_REQUEST,
  GRADING_DISPLAY_SUCCESS,
} from "../constants/gradingConstants";

export const displayGradingReducer = (state = { article: {} }, action) => {
  switch (action.type) {
    case GRADING_DISPLAY_REQUEST:
      return { loadingGrading: true, ...state };
    case GRADING_DISPLAY_SUCCESS:
      return { loadingGrading: false, grading: action.payload };
    case GRADING_DISPLAY_FAIL:
      return { loadingGrading: false, error: action.payload };
    default:
      return state;
  }
};
