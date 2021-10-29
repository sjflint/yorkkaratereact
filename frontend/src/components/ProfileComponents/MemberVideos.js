import { useEffect, useState } from "react";
import { ListGroup, Row, Col, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import dojoImg from "../../img/dojo.jpeg";
import { listTrainingVideos } from "../../actions/TrainingVideoActions";
import Loader from "../Loader";
import Message from "../Message";
import BeltCard from "../BeltCard";

const MemberVideos = () => {
  const dispatch = useDispatch();

  const [showKyu, setShowKyu] = useState(false);
  const handleCloseKyu = () => setShowKyu(false);
  const handleShowKyu = () => setShowKyu(true);

  const trainingVideoList = useSelector((state) => state.trainingVideoList);
  const { loadingTrainingVideos, error, trainingVideos } = trainingVideoList;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    dispatch(listTrainingVideos());
  }, [dispatch]);

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

  let grade;
  let nextGrade;
  if (member && member.kyuGrade === 0) {
    grade = `${member.danGrade}${numberMarker} dan`;
    nextGrade = `${member.danGrade + 1}${numberMarker} dan`;
  } else {
    grade = `${member.kyuGrade}${numberMarker} kyu`;
    nextGrade = `${member.kyuGrade - 1}${numberMarker} kyu`;
  }

  let filteredVideos = [];
  let kihonVideos = [];
  let kihonKumiteVideos = [];
  let shobuKumiteVideos = [];
  let kataVideos = [];

  if (trainingVideos) {
    trainingVideos.map((trainingVideo) => {
      if (trainingVideo.grade.includes(nextGrade)) {
        filteredVideos.push(trainingVideo);
      }
      return filteredVideos;
    });
  }

  filteredVideos.map((trainingVideo) => {
    if (trainingVideo.category === "Kihon") {
      kihonVideos.push(trainingVideo);
    }
    if (trainingVideo.category === "Kihon Kumite") {
      kihonKumiteVideos.push(trainingVideo);
    }
    if (trainingVideo.category === "Shobu Kumite") {
      shobuKumiteVideos.push(trainingVideo);
    }

    return filteredVideos;
  });

  if (trainingVideos) {
    trainingVideos.map((trainingVideo) => {
      if (
        trainingVideo.grade.includes(nextGrade) &&
        trainingVideo.category === "Kata"
      ) {
        kataVideos.push(trainingVideo);
      }

      return kataVideos;
    });
  }

  return (
    <>
      <img src={dojoImg} alt="dojo" />
      <h2 className="border-bottom border-warning mt-2 text-warning">
        Training Videos
      </h2>
      <h5 className="my-3">Your Current Status:</h5>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <strong className="text-white">Grade: </strong>
          {grade}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong className="text-white">
            Training time required before next grading:{" "}
          </strong>
          10 hours
        </ListGroup.Item>
        <ListGroup.Item>
          <strong className="text-white">
            Total hours completed to date:{" "}
          </strong>
          0 hours
        </ListGroup.Item>
        <ListGroup.Item>
          <strong className="text-white">Next Grade: </strong>
          {nextGrade}
        </ListGroup.Item>
        <ListGroup.Item>
          <p className="btn btn-light" onClick={handleShowKyu}>
            View the different belt colours
          </p>
        </ListGroup.Item>

        {loadingTrainingVideos ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading videos">
            {error}
          </Message>
        ) : (
          <>
            <ListGroup.Item>
              <h5 className="my-3 text-white">Kihon for {nextGrade}</h5>
              <p>
                Kihon is the basic movememnts performed solo. The examiner is
                looking for the perfect execution of the given techniques. Take
                the time to study each technique in great detail.
              </p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {kihonVideos.length !== 0 ? (
                  kihonVideos.map((trainingVideo) => (
                    <Col
                      sm={12}
                      md={6}
                      key={trainingVideo._id}
                      className="p-1 text-center text-white"
                    >
                      <a href={`/trainingVideos/${trainingVideo._id}`}>
                        <img src={trainingVideo.img} alt="" />

                        <p>{trainingVideo.title}</p>
                      </a>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No kihon videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="my-3 text-white">Kihon Kumite for {nextGrade}</h5>
              <p>Kihon Kumite is very important blah blah blah</p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {kihonKumiteVideos.length !== 0 ? (
                  kihonKumiteVideos.map((trainingVideo) => (
                    <Col
                      sm={12}
                      md={6}
                      key={trainingVideo._id}
                      className="p-1 text-center text-white"
                    >
                      <a href={`/trainingVideos/${trainingVideo._id}`}>
                        <img src={trainingVideo.img} alt="" />
                        <p>{trainingVideo.title}</p>
                      </a>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No kumite videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="my-3 text-white">Shobu Kumite for {nextGrade}</h5>
              <p>Shobu Kumite is very important blah blah blah</p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {shobuKumiteVideos.length !== 0 ? (
                  shobuKumiteVideos.map((trainingVideo) => (
                    <Col
                      sm={12}
                      md={6}
                      key={trainingVideo._id}
                      className="p-1 text-center text-white"
                    >
                      <a href={`/trainingVideos/${trainingVideo._id}`}>
                        <img src={trainingVideo.img} alt="" />
                        <p>{trainingVideo.title}</p>
                      </a>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No kumite videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="my-3 text-white">
                Kata for {nextGrade} and below
              </h5>
              <p>Kata is very important blah blah blah</p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {kataVideos.length !== 0 ? (
                  kataVideos.map((trainingVideo) => (
                    <Col
                      sm={12}
                      md={6}
                      key={trainingVideo._id}
                      className="p-1 text-center text-white"
                    >
                      <a href={`/trainingVideos/${trainingVideo._id}`}>
                        <img src={trainingVideo.img} alt="" />
                        <p>{trainingVideo.title}</p>
                      </a>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No kata videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
          </>
        )}
      </ListGroup>

      <Modal show={showKyu} onHide={handleCloseKyu}>
        <Modal.Header className="bg-secondary text-white" closeButton>
          <Modal.Title>Belt Colours</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <Row>
            <BeltCard grade="beginner" beltColor="White" />
            <BeltCard grade="15th Kyu" beltColor="White-Red" />
            <BeltCard grade="14th Kyu" beltColor="White-Black" />
            <BeltCard grade="13th Kyu" beltColor="Orange" />
            <BeltCard grade="12th Kyu" beltColor="Orange-White" />
            <BeltCard grade="11th Kyu" beltColor="Orange-Yellow" />
            <BeltCard grade="10th Kyu" beltColor="Orange-Black" />
            <BeltCard grade="9th Kyu" beltColor="Red" />
            <BeltCard grade="8th Kyu" beltColor="Red-Black" />
            <BeltCard grade="7th Kyu" beltColor="Yellow" />
            <BeltCard grade="6th Kyu" beltColor="Green" />
            <BeltCard grade="5th Kyu" beltColor="Purple" />
            <BeltCard grade="4th Kyu" beltColor="Purple-White" />
            <BeltCard grade="3th Kyu" beltColor="Brown" />
            <BeltCard grade="2th Kyu" beltColor="Brown-White" />
            <BeltCard grade="1st Kyu" beltColor="Brown-Double-White" />
            <BeltCard grade="1st dan" beltColor="Black" />
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          <Button onClick={handleCloseKyu}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberVideos;
