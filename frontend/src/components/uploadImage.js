import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../actions/uploadFileActions";
import defaultPlaceholder from "../img/defaultplaceholder.jpg";
import Message from "./Message";
import Uploading from "../img/uploading(1).gif";

// Type options:
// -Profile
// -Event
// -Product
// -Article

const UploadImage = ({ img, type, id, buttonText, singleImageData }) => {
  const [currentImage, setCurrentImage] = useState(
    img ? img : defaultPlaceholder
  );

  if (!id) {
    id = "newUpload";
  }
  const imageData = {
    type,
    id,
  };

  const dispatch = useDispatch();

  const uploadImg = useSelector((state) => state.uploadImg);
  const { loading, error, image } = uploadImg;

  const onChange = async (e) => {
    if (e.target.files[0]) {
      await dispatch(uploadImage(e, imageData));
    }
  };

  useEffect(() => {
    if (image) {
      setCurrentImage(defaultPlaceholder);
      setCurrentImage(image);
      console.log(image);
      singleImageData(image);
    }
  }, [dispatch, image, id, singleImageData]);

  return (
    <>
      {loading ? (
        <img src={Uploading} alt="uploading placeholder" />
      ) : error ? (
        <Message variant="danger">
          File couldn't be uploaded. File must be png/jpg/jpeg and not be more
          than 1MB in size
        </Message>
      ) : (
        <img src={currentImage} alt="" className="w-100" />
      )}
      <label className="d-block btn btn-default py-0 my-1 text-center custom-fileupload-button">
        <input type="file" name="image" onChange={onChange} />
        {buttonText ? buttonText : "Change Image"}
      </label>
    </>
  );
};

export default UploadImage;
