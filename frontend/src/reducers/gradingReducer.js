import {
  GRADING_DISPLAY_FAIL,
  GRADING_DISPLAY_REQUEST,
  GRADING_DISPLAY_SUCCESS,
  LIST_GRADING_RESULTS_FAIL,
  LIST_GRADING_RESULTS_REQUEST,
  LIST_GRADING_RESULTS_SUCCESS,
} from "../constants/gradingConstants";

export const displayGradingReducer = (state = { grading: {} }, action) => {
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

export const listGradingResultsReducer = (
  state = { gradingResults: [] },
  action
) => {
  switch (action.type) {
    case LIST_GRADING_RESULTS_REQUEST:
      return { loading: true, gradingResult: [] };
    case LIST_GRADING_RESULTS_SUCCESS:
      return { loading: false, gradingResults: action.payload };
    case LIST_GRADING_RESULTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
