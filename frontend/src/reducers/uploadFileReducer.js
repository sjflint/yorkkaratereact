import {
  UPLOAD_FILE_CLEAR,
  UPLOAD_FILE_FAIL,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_IMG_CLEAR,
  UPLOAD_IMG_FAIL,
  UPLOAD_IMG_REQUEST,
  UPLOAD_IMG_SUCCESS,
  UPLOAD_VIDEO_CLEAR,
  UPLOAD_VIDEO_FAIL,
  UPLOAD_VIDEO_REQUEST,
  UPLOAD_VIDEO_SUCCESS,
} from "../constants/uploadFileConstants";

export const uploadImgReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_IMG_REQUEST:
      return { loading: true };
    case UPLOAD_IMG_SUCCESS:
      return { loading: false, success: true, image: action.payload };
    case UPLOAD_IMG_FAIL:
      return { loading: false, error: action.payload };
    case UPLOAD_IMG_CLEAR:
      return {};
    default:
      return state;
  }
};

export const uploadVideoReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_VIDEO_REQUEST:
      return { loading: true };
    case UPLOAD_VIDEO_SUCCESS:
      return { loading: false, success: true, video: action.payload };
    case UPLOAD_VIDEO_FAIL:
      return { loading: false, error: action.payload };
    case UPLOAD_VIDEO_CLEAR:
      return {};
    default:
      return state;
  }
};

export const uploadFileReducer = (state = {}, action) => {
  switch (action.type) {
    case UPLOAD_FILE_REQUEST:
      return { loading: true };
    case UPLOAD_FILE_SUCCESS:
      return { loading: false, success: true, file: action.payload };
    case UPLOAD_FILE_FAIL:
      return { loading: false, error: action.payload };
    case UPLOAD_FILE_CLEAR:
      return {};
    default:
      return state;
  }
};
