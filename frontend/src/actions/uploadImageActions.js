import axios from "axios";
import {
  UPLOAD_IMG_FAIL,
  UPLOAD_IMG_REQUEST,
  UPLOAD_IMG_SUCCESS,
} from "../constants/uploadImageConstants";

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

    const { data } = await axios.post("/api/upload", formData, config);

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
