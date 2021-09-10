import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMemberDetails } from "../actions/memberActions";
import {
  listTrainingVideo,
  listTrainingVideos,
} from "../actions/TrainingVideoActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Video from "../components/Video";

const TrainingVideoScreen = ({ match }) => {
  const dispatch = useDispatch();

  const displayTrainingVideo = useSelector(
    (state) => state.displayTrainingVideo
  );
  const { loadingTrainingVideo, errorTrainingVideo, video } =
    displayTrainingVideo;

  const trainingVideoList = useSelector((state) => state.trainingVideoList);
  const { loadingTrainingVideos, errorTrainingVideos, trainingVideos } =
    trainingVideoList;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    dispatch(listTrainingVideo(match.params.id));
    dispatch(listTrainingVideos());
    dispatch(getMemberDetails("profile"));
  }, [dispatch, match]);

  const playAudio = () => {
    const audioEl = document.getElementById("soundFile");
    console.log("playing audio");
    audioEl.play();
  };

  let numberMarker;
  switch (member.kyuGrade && member.kyuGrade !== 0) {
    case 1:
      numberMarker = "st";
      break;
    case 2:
      numberMarker = "nd";
      break;
    case 3:
      numberMarker = "rd";
      break;
    default:
      numberMarker = "th";
  }
  switch (member.danGrade && member.danGrade !== 0) {
    case 1:
      numberMarker = "st";
      break;
    case 2:
      numberMarker = "nd";
      break;
    case 3:
      numberMarker = "rd";
      break;
    default:
      numberMarker = "th";
  }

  let nextGrade;
  if (member && member.kyuGrade === 0) {
    nextGrade = `${member.danGrade + 1}${numberMarker} dan`;
  } else {
    nextGrade = `${member.kyuGrade - 1}${numberMarker} kyu`;
  }

  let filteredVideos = [];

  if (trainingVideos) {
    trainingVideos.map((trainingVideo) => {
      if (trainingVideo.grade.includes(nextGrade)) {
        filteredVideos.push(trainingVideo);
      }
      return filteredVideos;
    });
  }

  return (
    <Container fluid="lg">
      <Row>
        <Col lg={8}>
          {loadingTrainingVideo ? (
            <Loader variant="warning" />
          ) : errorTrainingVideo ? (
            <Message variant="warning" heading="Training video failed to load">
              {errorTrainingVideo}
            </Message>
          ) : (
            <>
              <Video poster={video.img} mp4={video.video} />
              <h4 className="text-white mt-3">{video.title}</h4>
              <small>
                Category - {video.category}
                <br />
                Kyu grade level - {video.grade && video.grade[0]}
              </small>
              <br />
              <div className="btn btn-light mt-2" onClick={playAudio}>
                <i className="fas fa-volume-up"> Pronunciation</i>
              </div>
              <audio src={video.soundFile} id="soundFile"></audio>
            </>
          )}
        </Col>
        <Col lg={4} className="mt-2">
          {loadingTrainingVideos ? (
            <Loader variant="warning" />
          ) : errorTrainingVideos ? (
            <Message variant="warning" heading="Training videos failed to load">
              {errorTrainingVideos}
            </Message>
          ) : (
            <>
              {filteredVideos.map((trainingVideo) => (
                <div
                  sm={12}
                  md={6}
                  key={trainingVideo._id}
                  className="p-1 text-center text-white"
                >
                  <a href={`/trainingVideos/${trainingVideo._id}`}>
                    <Row>
                      <Col sm={4}>
                        <img src={trainingVideo.img} alt="" />
                      </Col>
                      <Col className="d-flex justiify-content-center">
                        <p className="text-left align-self-center">
                          {trainingVideo.title}
                        </p>
                      </Col>
                    </Row>
                  </a>
                </div>
              ))}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrainingVideoScreen;
