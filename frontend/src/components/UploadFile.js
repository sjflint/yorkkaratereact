import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../actions/uploadFileActions";
import { UPLOAD_FILE_CLEAR } from "../constants/uploadFileConstants";
import Message from "./Message";
import defaultPlaceholder from "../img/defaultplaceholder.jpg";
import Uploading from "../img/uploading(1).gif";

const UploadFile = ({ id, currFile, singleFileData, buttonText }) => {
  const [currentFile, setCurrentFile] = useState(
    currFile ? currFile : "No File - Please upload"
  );
  if (!id) {
    id = "newUpload";
  }

  const dispatch = useDispatch();

  const uploadCurrFile = useSelector((state) => state.uploadCurrFile);
  const { loading, error, file } = uploadCurrFile;

  const onChange = (e) => {
    dispatch(uploadFile(e, id));
  };

  useEffect(() => {
    if (file) {
      setCurrentFile(defaultPlaceholder);
      setCurrentFile(file);
      if (id === "newUpload") {
        singleFileData(file);
      }
    }
    dispatch({ type: UPLOAD_FILE_CLEAR });
  }, [dispatch, file, id, singleFileData]);
  return (
    <div>
      <>
        {loading ? (
          <>
            {singleFileData("loading")}
            <img src={Uploading} alt="uploading placeholder" />
          </>
        ) : error ? (
          <Message variant="danger">
            File couldn't be uploaded. File must be mp3 and not more than 1MB
          </Message>
        ) : (
          <div className="text-center bg-light">
            <p>
              Uploaded File: <br />
              {currentFile !== "No File - Please upload" ? (
                <div className="text-success">
                  <i className="fa-solid fa-circle-check"></i> File Uploaded
                </div>
              ) : (
                <>
                  <i className="fa-solid fa-file"></i> Please upload file
                </>
              )}
            </p>
          </div>
        )}

        <label className="d-block btn btn-default py-2 my-1 text-center custom-fileupload-button">
          <input type="file" name="video" onChange={onChange} />
          {buttonText ? buttonText : "Upload File"}
        </label>
      </>
    </div>
  );
};

export default UploadFile;
