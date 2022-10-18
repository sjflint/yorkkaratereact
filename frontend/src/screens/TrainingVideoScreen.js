import { useEffect, useState } from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  listTrainingVideo,
  listTrainingVideosByGrade,
} from "../actions/TrainingVideoActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Video from "../components/Video";

const TrainingVideoScreen = ({ match }) => {
  const [volume, setVolume] = useState("stop");

  const dispatch = useDispatch();

  const displayTrainingVideo = useSelector(
    (state) => state.displayTrainingVideo
  );
  const { loadingTrainingVideo, errorTrainingVideo, video } =
    displayTrainingVideo;

  const trainingVideoListByGrade = useSelector(
    (state) => state.trainingVideoListByGrade
  );
  const { loadingTrainingVideos, errorTrainingVideos, trainingVideos } =
    trainingVideoListByGrade;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    dispatch(listTrainingVideo(match.params.id));
    if (member && member.kyuGrade > 0) {
      const grade = member.kyuGrade - 1;
      dispatch(listTrainingVideosByGrade(grade));
    }

    if (member && member.kyuGrade === 0) {
      const grade = (member.danGrade + 1) * -1;
      dispatch(listTrainingVideosByGrade(grade));
    }
  }, [dispatch, match, member]);

  const playAudio = () => {
    const audioEl = document.getElementById("soundFile");
    setVolume("play");

    audioEl.play();
  };

  return (
    <Container fluid="lg" className="mt-3">
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
              <ListGroup variant="flush" className="bg-primary p-1">
                <ListGroup.Item>
                  <Video poster={video.img} mp4={video.video} />
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>{video.title}</h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className="m-0">Category - {video.category}</p>
                </ListGroup.Item>
                <ListGroup.Item>
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
                {trainingVideos.map(
                  (trainingVideo) =>
                    trainingVideo._id !== match.params.id && (
                      <ListGroup.Item key={trainingVideo._id}>
                        <Row className="no-gutters align-items-center">
                          <Col key={trainingVideo._id} lg={7} sm={4} xs={6}>
                            <a href={`/trainingvideos/${trainingVideo._id}`}>
                              <img src={trainingVideo.img} alt="" />
                            </a>
                          </Col>

                          <Col className="ml-2">
                            <a href={`/trainingvideos/${trainingVideo._id}`}>
                              <p className="mb-1">{trainingVideo.title}</p>
                            </a>
                            <a href={`/trainingvideos/${trainingVideo._id}`}>
                              <small>
                                <span>Category</span> <br />{" "}
                                {trainingVideo.category} <br />
                              </small>
                            </a>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )
                )}
              </ListGroup>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TrainingVideoScreen;
