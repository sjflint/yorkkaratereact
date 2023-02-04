import { useEffect, useState } from "react";
import { ListGroup, Row, Col, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import dojoImg from "../../img/dojo.jpeg";
import { listTrainingVideosByGrade } from "../../actions/TrainingVideoActions";
import Loader from "../Loader";
import Message from "../Message";
import BeltCard from "../BeltCard";

const MemberVideos = () => {
  const dispatch = useDispatch();

  const [showKyu, setShowKyu] = useState(false);
  const handleCloseKyu = () => setShowKyu(false);
  const handleShowKyu = () => setShowKyu(true);

  const trainingVideoListByGrade = useSelector(
    (state) => state.trainingVideoListByGrade
  );
  const { loadingTrainingVideos, error, trainingVideos } =
    trainingVideoListByGrade;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    if (member && member.kyuGrade > 1) {
      const grade = member.kyuGrade - 1;
      console.log(grade);
      dispatch(listTrainingVideosByGrade(grade));
    }

    if (member && member.kyuGrade === 1) {
      const grade = -1;

      console.log(grade);
      dispatch(listTrainingVideosByGrade(grade));
    }

    if (member && member.kyuGrade === 0) {
      const grade = (member.danGrade + 1) * -1;
      console.log(grade);

      dispatch(listTrainingVideosByGrade(grade));
    }
  }, [dispatch, member]);

  const marker = (num) => {
    return num === 1 ? "st" : num === 2 ? "nd" : "th";
  };

  let grade;

  let nextGradePrefix;

  if (member && member.kyuGrade === 0) {
    const currGrade = member.danGrade;
    grade = `${currGrade + marker(currGrade)} dan`;

    nextGradePrefix = `${
      member.danGrade + 1 + marker(member.danGrade + 1)
    } dan`;
  } else {
    const currGrade = member.kyuGrade;
    grade = `${currGrade + marker(currGrade)} kyu`;
    if (currGrade - 1 === 0) {
      nextGradePrefix = `${member.kyuGrade + marker(member.kyuGrade)} dan`;
    } else {
      nextGradePrefix = `${
        member.kyuGrade - 1 + marker(member.kyuGrade - 1)
      } kyu`;
    }
  }

  let kihonVideos = 0;
  let kihonKumiteVideos = 0;
  let shobuKumiteVideos = 0;
  let kataVideos = 0;

  return (
    <>
      <img src={dojoImg} alt="dojo" />
      <h2 className="border-bottom border-warning mt-2 text-warning text-center">
        Training Videos
      </h2>

      <ListGroup variant="flush">
        <Row className="mt-2">
          <Col sm={6}>
            <h5 className="mb-0 border-bottom border-warning text-center mb-2">
              Your Current Status
            </h5>
            <ListGroup.Item>
              <strong>Grade: </strong>
              {grade}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>
                Total number of sessions required before next grading:{" "}
              </strong>
              {member.numberOfSessionsRequired}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Total sessions completed towards the next grade: </strong>
              {member.attendanceRecord}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Next Grade: </strong>
              {nextGradePrefix}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                className="btn-sm w-100"
                variant="outline-secondary"
                onClick={handleShowKyu}
              >
                View the different belt colours
              </Button>
            </ListGroup.Item>
          </Col>
          {member.nameFirst && member.gradeLevel !== "Advanced" && (
            <Col sm={5} className="p-2 text-center">
              <h5 className="mb-0 border-bottom border-warning">
                Attendance Card
              </h5>
              {member.attendanceRecord > member.numberOfSessionsRequired ? (
                <img
                  src={`/img/Stampcards/${member.gradeLevel}Card${member.numberOfSessionsRequired}.png`}
                  alt=""
                  className="max-width-300"
                />
              ) : (
                <img
                  src={`/img/Stampcards/${member.gradeLevel}Card${member.attendanceRecord}.png`}
                  alt=""
                  className="max-width-300"
                />
              )}
            </Col>
          )}
        </Row>
        {loadingTrainingVideos ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading videos">
            {error}
          </Message>
        ) : (
          <>
            <ListGroup.Item>
              <h5 className="my-3 text-warning">Kihon for {nextGradePrefix}</h5>
              <p>
                Kihon is the basic movememnts performed solo. The examiner is
                looking for the perfect execution of the given techniques. Take
                the time to study each technique in great detail.
              </p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {trainingVideos &&
                  trainingVideos.map((trainingVideo) => {
                    trainingVideo.category === "Kihon" && kihonVideos++;
                    return (
                      trainingVideo.category === "Kihon" && (
                        <Col
                          sm={12}
                          md={6}
                          key={trainingVideo._id}
                          className="p-1 text-center text-white"
                        >
                          <a href={`/trainingVideos/${trainingVideo._id}`}>
                            <img src={trainingVideo.img} alt="" />
                          </a>
                          <p>{trainingVideo.title}</p>
                        </Col>
                      )
                    );
                  })}
                {kihonVideos === 0 && (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No kihon videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="my-3 text-warning">
                Kihon Kumite for {nextGradePrefix}
              </h5>
              <p>
                Kihon Kumite is the practical test of your basic kihon
                techniques with a partner. Attention must be given to the
                correct application of technique, including stances and hand
                positions.
              </p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {trainingVideos &&
                  trainingVideos.map((trainingVideo) => {
                    trainingVideo.category === "Kihon Kumite" &&
                      kihonKumiteVideos++;
                    return (
                      trainingVideo.category === "Kihon Kumite" && (
                        <Col
                          sm={12}
                          md={6}
                          key={trainingVideo._id}
                          className="p-1 text-center text-white"
                        >
                          <a href={`/trainingVideos/${trainingVideo._id}`}>
                            <img src={trainingVideo.img} alt="" />
                          </a>
                          <p>{trainingVideo.title}</p>
                        </Col>
                      )
                    );
                  })}
                {kihonKumiteVideos === 0 && (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No Kihon Kumite videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="my-3 text-warning">
                Shobu Kumite for {nextGradePrefix}
              </h5>
              <p>
                Shobu Kumite tests your ability to apply what you have learnt in
                a more 'fluid' combat environment with an unpredictable
                opponent. By not using perscribed attackes and counters, you
                will learn how to react to your opponent. The rules of 'shobu'
                (meaning competition) allow for you to improve your skills to
                compete in karate competitions.
              </p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {trainingVideos &&
                  trainingVideos.map((trainingVideo) => {
                    trainingVideo.category === "Shobu Kumite" &&
                      shobuKumiteVideos++;
                    return (
                      trainingVideo.category === "Shobu Kumite" && (
                        <Col
                          sm={12}
                          md={6}
                          key={trainingVideo._id}
                          className="p-1 text-center text-white"
                        >
                          <a href={`/trainingVideos/${trainingVideo._id}`}>
                            <img src={trainingVideo.img} alt="" />
                          </a>
                          <p>{trainingVideo.title}</p>
                        </Col>
                      )
                    );
                  })}
                {shobuKumiteVideos === 0 && (
                  <Col>
                    <h5 className="text-center mb-0 text-warning">
                      No kumite videos at your current level
                    </h5>
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h5 className="my-3 text-warning">
                Kata for {nextGradePrefix} and below
              </h5>
              <p>
                Kata is the essence of karate. You must learn the precise
                movements of the kata and then perform them at speed and power,
                with focus and control. Kata was originally a way for the
                ancient masters to remember and pass on their understanding, as
                karate was not written down, but now is the ultimate test of
                your karate skill.
              </p>
              <Row className="bg-dark border-warning border-bottom border-top py-3 no-gutters">
                {trainingVideos &&
                  trainingVideos.map((trainingVideo) => {
                    trainingVideo.category === "Kata" && kataVideos++;
                    return (
                      trainingVideo.category === "Kata" && (
                        <Col
                          sm={12}
                          md={6}
                          key={trainingVideo._id}
                          className="p-1 text-center text-white"
                        >
                          <a href={`/trainingVideos/${trainingVideo._id}`}>
                            <img src={trainingVideo.img} alt="" />
                          </a>
                          <p>{trainingVideo.title}</p>
                        </Col>
                      )
                    );
                  })}
                {kataVideos === 0 && (
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
