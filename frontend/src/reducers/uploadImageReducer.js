import {
  UPLOAD_IMG_CLEAR,
  UPLOAD_IMG_FAIL,
  UPLOAD_IMG_REQUEST,
  UPLOAD_IMG_SUCCESS,
} from "../constants/uploadImageConstants";

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
