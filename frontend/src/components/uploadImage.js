import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../actions/uploadImageActions";
import defaultPlaceholder from "../img/defaultplaceholder.jpg";
import Loader from "./Loader";
import Message from "./Message";
import { UPLOAD_IMG_CLEAR } from "../constants/uploadImageConstants";

// Type options:
// -Profile
// -Event
// -Product
// -Article

const UploadImage = ({ img, type, id, singleImageData, buttonText }) => {
  if (!id) {
    id = "newUpload";
  }
  const imageData = {
    type,
    id,
  };

  const dispatch = useDispatch();

  const [uploadedImage, setUploadedImage] = useState();

  const uploadImg = useSelector((state) => state.uploadImg);
  const { loading, error, image } = uploadImg;

  const onChange = async (e) => {
    if (e.target.files[0]) {
      dispatch(uploadImage(e, imageData));
    }
  };

  useEffect(() => {
    if (image) {
      setUploadedImage(image);
      if (singleImageData) {
        singleImageData(image);
      }

      dispatch({ type: UPLOAD_IMG_CLEAR });
    } else if (uploadedImage) {
    } else if (img) {
      setUploadedImage(img);
    } else {
      setUploadedImage(defaultPlaceholder);
    }
  }, [dispatch, img, image, uploadedImage, singleImageData]);

  return (
    <>
      <label className="d-block btn-secondary py-2 my-1 text-center custom-fileupload-button">
        <input type="file" name="image" onChange={onChange} />
        {buttonText ? buttonText : "Change Image"}
      </label>
      {loading && <Loader variant="warning" />}
      {error && (
        <Message variant="danger">
          File couldn't be uploaded. File must be png/jpg/jpeg and not be more
          than 1MB in size
        </Message>
      )}
    </>
  );
};

export default UploadImage;
