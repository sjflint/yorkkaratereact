import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadVideo } from "../actions/uploadFileActions";

import Message from "./Message";
import defaultPlaceholder from "../img/defaultplaceholder.jpg";
import Uploading from "../img/uploading(1).gif";
import Video from "../components/Video";

const UploadVideo = ({ id, vid, singleVideoData }) => {
  const [currentVideo, setCurrentVideo] = useState(
    vid ? vid : defaultPlaceholder
  );
  if (!id) {
    id = "newUpload";
  }

  const dispatch = useDispatch();

  const uploadVid = useSelector((state) => state.uploadVid);
  const { loading, error, video } = uploadVid;

  const onChange = (e) => {
    dispatch(uploadVideo(e, id));
  };

  useEffect(() => {
    // dispatch({ type: UPLOAD_VIDEO_CLEAR });
    if (video) {
      setCurrentVideo(defaultPlaceholder);
      setCurrentVideo(video);
      if (id === "newUpload") {
        console.log(video);
        singleVideoData(video);
      }
    }
  }, [dispatch, video, id, singleVideoData]);
  return (
    <div>
      <>
        {loading ? (
          <>
            {singleVideoData("loading")}
            <img src={Uploading} alt="uploading placeholder" />
          </>
        ) : error ? (
          <Message variant="danger">
            File couldn't be uploaded. File must be mp4 and not more than 400MB
          </Message>
        ) : (
          <Video mp4={`${currentVideo}#t=2`} />
        )}

        {/* Change a video for an exisitng record */}

        <label className="d-block btn btn-default py-0 my-1 text-center custom-fileupload-button">
          <input type="file" name="video" onChange={onChange} />
          Upload Video
        </label>
      </>
    </div>
  );
};

export default UploadVideo;
