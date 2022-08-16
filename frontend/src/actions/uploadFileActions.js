import axios from "axios";
import {
  UPLOAD_FILE_FAIL,
  UPLOAD_FILE_REQUEST,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_IMG_FAIL,
  UPLOAD_IMG_REQUEST,
  UPLOAD_IMG_SUCCESS,
  UPLOAD_VIDEO_FAIL,
  UPLOAD_VIDEO_REQUEST,
  UPLOAD_VIDEO_SUCCESS,
} from "../constants/uploadFileConstants";

export const uploadImage = (e, imageData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPLOAD_IMG_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", imageData.type);
    formData.append("id", imageData.id);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/upload/image", formData, config);

    dispatch({
      type: UPLOAD_IMG_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_IMG_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const uploadVideo = (e, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPLOAD_VIDEO_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("video", file);
    formData.append("id", id);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/upload/video", formData, config);

    dispatch({
      type: UPLOAD_VIDEO_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_VIDEO_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const uploadFile = (e, id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: UPLOAD_FILE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post("/api/upload/file", formData, config);

    dispatch({
      type: UPLOAD_FILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_FILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
