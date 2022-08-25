import {
  TRAINING_VIDEO_LIST_REQUEST,
  TRAINING_VIDEO_LIST_SUCCESS,
  TRAINING_VIDEO_LIST_FAIL,
  TRAINING_VIDEO_DISPLAY_REQUEST,
  TRAINING_VIDEO_DISPLAY_SUCCESS,
  TRAINING_VIDEO_DISPLAY_FAIL,
  TRAINING_VIDEO_DELETE_REQUEST,
  TRAINING_VIDEO_DELETE_SUCCESS,
  TRAINING_VIDEO_DELETE_FAIL,
  TRAINING_VIDEO_CREATE_REQUEST,
  TRAINING_VIDEO_CREATE_SUCCESS,
  TRAINING_VIDEO_CREATE_FAIL,
  TRAINING_VIDEO_CREATE_RESET,
  TRAINING_VIDEO_UPDATE_REQUEST,
  TRAINING_VIDEO_UPDATE_SUCCESS,
  TRAINING_VIDEO_UPDATE_FAIL,
  TRAINING_VIDEO_UPDATE_RESET,
  TRAINING_VIDEO_LIST_BYGRADE_REQUEST,
  TRAINING_VIDEO_LIST_BYGRADE_SUCCESS,
  TRAINING_VIDEO_LIST_BYGRADE_FAIL,
} from "../constants/trainingVideoConstants";

export const trainingVideoListReducer = (
  state = { trainingVideos: [] },
  action
) => {
  switch (action.type) {
    case TRAINING_VIDEO_LIST_REQUEST:
      return { loadingTrainingVideos: true, trainingVideos: [] };
    case TRAINING_VIDEO_LIST_SUCCESS:
      return {
        loadingTrainingVideos: false,
        trainingVideos: action.payload,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case TRAINING_VIDEO_LIST_FAIL:
      return { loadingTrainingVideos: false, error: action.payload };
    default:
      return state;
  }
};

export const trainingVideoListByGradeReducer = (
  state = { trainingVideos: [] },
  action
) => {
  switch (action.type) {
    case TRAINING_VIDEO_LIST_BYGRADE_REQUEST:
      return { loadingTrainingVideos: true, trainingVideos: [] };
    case TRAINING_VIDEO_LIST_BYGRADE_SUCCESS:
      return {
        loadingTrainingVideos: false,
        trainingVideos: action.payload,
      };
    case TRAINING_VIDEO_LIST_BYGRADE_FAIL:
      return { loadingTrainingVideos: false, error: action.payload };
    default:
      return state;
  }
};

export const displayTrainingVideoReducer = (state = { video: {} }, action) => {
  switch (action.type) {
    case TRAINING_VIDEO_DISPLAY_REQUEST:
      return { loadingTrainingVideo: true, ...state };
    case TRAINING_VIDEO_DISPLAY_SUCCESS:
      return { loadingTrainingVideo: false, video: action.payload };
    case TRAINING_VIDEO_DISPLAY_FAIL:
      return { loadingTrainingVideo: false, error: action.payload };
    default:
      return state;
  }
};

export const trainingVideoDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_VIDEO_DELETE_REQUEST:
      return { loading: true };
    case TRAINING_VIDEO_DELETE_SUCCESS:
      return { loadingTrainingVideo: false, success: true };
    case TRAINING_VIDEO_DELETE_FAIL:
      return { loadingTrainingVideo: false, error: action.payload };
    default:
      return state;
  }
};

export const trainingVideoCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_VIDEO_CREATE_REQUEST:
      return { loading: true };
    case TRAINING_VIDEO_CREATE_SUCCESS:
      return {
        loadingTrainingVideo: false,
        success: true,
        trainingVideo: action.payload,
      };
    case TRAINING_VIDEO_CREATE_FAIL:
      return { loadingTrainingVideo: false, error: action.payload };
    case TRAINING_VIDEO_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const trainingVideoUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAINING_VIDEO_UPDATE_REQUEST:
      return { loading: true };
    case TRAINING_VIDEO_UPDATE_SUCCESS:
      return { loading: false, success: true, trainingVideo: action.payload };
    case TRAINING_VIDEO_UPDATE_FAIL:
      return { loadingTrainingVideo: false, error: action.payload };
    case TRAINING_VIDEO_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
