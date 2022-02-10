import { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMemberDetails } from "../actions/memberActions";
import {
  listTrainingVideo,
  listTrainingVideos,
} from "../actions/TrainingVideoActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const TrainingVideoScreen = ({ match }) => {
  const [volume, setVolume] = useState("stop");

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
    setVolume("play");

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
        <Col md={7} lg={7}>
          {loadingTrainingVideo ? (
            <Loader variant="warning" />
          ) : errorTrainingVideo ? (
            <Message variant="warning" heading="Training video failed to load">
              {errorTrainingVideo}
            </Message>
          ) : (
            <>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div>
                    <iframe
                      src={video.video}
                      width="100%"
                      height="400"
                      allow="autoplay"
                      title={video._id}
                    ></iframe>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item variant="primary">
                  <h4>{video.title}</h4>
                </ListGroup.Item>
                <ListGroup.Item variant="primary">
                  <p className="m-0">Category - {video.category}</p>
                </ListGroup.Item>
                <ListGroup.Item variant="primary">
                  {volume === "stop" ? (
                    <>
                      <div className="btn btn-light mt-2" onClick={playAudio}>
                        <i
                          className="fa-solid fa-play"
                          style={{ color: "green" }}
                        >
                          {" "}
                        </i>{" "}
                        Pronunciation
                      </div>
                    </>
                  ) : (
                    <div className="btn btn-light mt-2" onClick={playAudio}>
                      <i
                        className="fa-solid fa-volume-high"
                        style={{ color: "green" }}
                      >
                        {" "}
                      </i>{" "}
                      Pronunciation
                    </div>
                  )}
                  <audio
                    src={video.soundFile}
                    id="soundFile"
                    onEnded={() => setVolume("stop")}
                  ></audio>
                </ListGroup.Item>
              </ListGroup>
            </>
          )}
        </Col>
        <Col md={5} lg={5} className="mt-2">
          {loadingTrainingVideos ? (
            <Loader variant="warning" />
          ) : errorTrainingVideos ? (
            <Message variant="warning" heading="Training videos failed to load">
              {errorTrainingVideos}
            </Message>
          ) : (
            <>
              {member.nameFirst && (
                <h5 className="border-bottom border-warning text-center">
                  Recommended Videos for {member.nameFirst}
                </h5>
              )}

              <ListGroup variant="flush">
                {filteredVideos.map((trainingVideo) => (
                  <ListGroup.Item key={trainingVideo._id} variant="primary">
                    <Row className="no-gutters align-items-center">
                      <Col key={trainingVideo._id} lg={7} sm={4} xs={6}>
                        <Link to={`/trainingvideos/${trainingVideo._id}`}>
                          <img src={trainingVideo.img} alt="" />
                        </Link>
                      </Col>

                      <Col className="ml-2">
                        <Link to={`/trainingvideos/${trainingVideo._id}`}>
                          <h5 className="mb-1">{trainingVideo.title}</h5>
                        </Link>
                        <Link to={`/trainingvideos/${trainingVideo._id}`}>
                          <small>
                            <span>Category</span> <br />{" "}
                            {trainingVideo.category} <br />
                          </small>
                        </Link>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrainingVideoScreen;
