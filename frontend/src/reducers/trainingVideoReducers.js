import {
  TRAINING_VIDEO_LIST_REQUEST,
  TRAINING_VIDEO_LIST_SUCCESS,
  TRAINING_VIDEO_LIST_FAIL,
  TRAINING_VIDEO_DISPLAY_REQUEST,
  TRAINING_VIDEO_DISPLAY_SUCCESS,
  TRAINING_VIDEO_DISPLAY_FAIL,
} from "../constants/trainingVideoConstants";

export const trainingVideoListReducer = (
  state = { trainingVideos: [] },
  action
) => {
  switch (action.type) {
    case TRAINING_VIDEO_LIST_REQUEST:
      return { loadingTrainingVideos: true, trainingVideos: [] };
    case TRAINING_VIDEO_LIST_SUCCESS:
      return { loadingTrainingVideos: false, trainingVideos: action.payload };
    case TRAINING_VIDEO_LIST_FAIL:
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
