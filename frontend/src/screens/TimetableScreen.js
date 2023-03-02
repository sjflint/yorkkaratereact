import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
} from "react-bootstrap";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import TrainingSession from "../components/TrainingSession";
import Loader from "../components/Loader";
import Message from "../components/Message";
import BeltCard from "../components/BeltCard";
import ImgStChads from "../img/st.chadshalltrimmed.jpg";
import ImgJoRo from "../img/josephrowntreetrimmed.jpg";
import ImgArchHol from "../img/archbishoptrimmed.jpg";
import ImgStrensall from "../img/strensalltrimmed.jpg";

const TimetableScreen = () => {
  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  const dispatch = useDispatch();
  const [ageGroup, setAgeGroup] = useState("under9");
  const [grade, setGrade] = useState(16);
  const [show, setShow] = useState(false);
  const [classList, setClassList] = useState("");

  const [showKyu, setShowKyu] = useState(false);
  const handleCloseKyu = () => setShowKyu(false);
  const handleShowKyu = () => setShowKyu(true);

  useEffect(() => {
    dispatch(listTrainingSessions());
  }, [dispatch]);

  const handleAgeGroup = (e) => {
    setAgeGroup(e.target.value);
  };

  const handleGrade = (e) => {
    setGrade(Number(e.target.value));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(ageGroup);
    console.log(grade);
    if (ageGroup === "under9" && grade >= 11) {
      const filteredClass = trainingSessions.filter(
        (trainingSession) => trainingSession.juniorSession === true
      );
      setClassList(filteredClass);
      setShow(true);
    } else {
      const filteredClass = trainingSessions.filter(
        (trainingSession) =>
          trainingSession.minGradeLevel >= grade &&
          trainingSession.maxGradeLevel <= grade &&
          trainingSession.juniorSession === false
      );
      setClassList(filteredClass);
      setShow(true);
    }
  };

  const dateYesterday = new Date();
  dateYesterday.setDate(dateYesterday.getDate() - 1);

  return (
    <div className="mt-3">
      <Container fluid="lg">
        <h3 className="text-center border-bottom border-warning pb-1">
          Timetable
        </h3>

        {loading ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading timetable">
            {error}
          </Message>
        ) : (
          <Row>
            <Col md={12} lg={9}>
              <Row>
                <Col md={6}>
                  <Image
                    src={ImgStChads}
                    alt="monday dojo"
                    className="border-top border-warning mt-2 p-2 bg-primary"
                  />
                  <TrainingSession
                    trainingSessions={trainingSessions}
                    trainingDay={"Monday"}
                  />
                </Col>
                <Col md={6}>
                  <Image
                    src={ImgJoRo}
                    alt="monday dojo"
                    className="border-top border-warning mt-2 p-2 bg-primary"
                  />
                  <TrainingSession
                    trainingSessions={trainingSessions}
                    trainingDay={"Tuesday"}
                  />
                </Col>
                <Col md={6}>
                  <Image
                    src={ImgJoRo}
                    alt="monday dojo"
                    className="border-top border-warning mt-2 p-2 bg-primary"
                  />
                  <TrainingSession
                    trainingSessions={trainingSessions}
                    trainingDay={"Wednesday"}
                  />
                </Col>
                <Col md={6}>
                  <Image
                    src={ImgArchHol}
                    alt="monday dojo"
                    className="border-top border-warning mt-2 p-2 bg-primary"
                  />
                  <TrainingSession
                    trainingSessions={trainingSessions}
                    trainingDay={"Thursday"}
                  />
                </Col>
                <Col md={6}>
                  <Image
                    src={ImgStrensall}
                    alt="monday dojo"
                    className="border-top border-warning mt-2 p-2 bg-primary"
                  />
                  <TrainingSession
                    trainingSessions={trainingSessions}
                    trainingDay={"Friday"}
                  />
                </Col>
                <Col md={6}>
                  <Image
                    src={ImgStrensall}
                    alt="monday dojo"
                    className="border-top border-warning mt-2 p-2 bg-primary"
                  />
                  <TrainingSession
                    trainingSessions={trainingSessions}
                    trainingDay={"Saturday"}
                  />
                </Col>
              </Row>
            </Col>
            <Col md={12} lg={3}>
              <>
                <h6 className="text-center border-bottom border-warning p-1 mt-3">
                  Cancellations
                </h6>
                <p>
                  If there are any scheduled class cancellations, they will be
                  listed below. Members will also be contacted via email
                </p>
                <ListGroup className="mb-3">
                  <ListGroupItem className="bg-warning text-white">
                    Upcoming Cancellations:
                  </ListGroupItem>
                  <ListGroupItem></ListGroupItem>
                  {trainingSessions &&
                    trainingSessions.map((trainingSession) => {
                      let cancelledClasses = [];

                      trainingSession.cancelledClasses.map((classes) => {
                        if (new Date(classes) >= dateYesterday) {
                          return cancelledClasses.push(
                            new Date(classes).toLocaleDateString()
                          );
                        }
                      });
                      {
                      }
                      return (
                        cancelledClasses.length > 0 && (
                          <>
                            <ListGroupItem className="mb-1 bg-grey">
                              <small>
                                {trainingSession.name}{" "}
                                {trainingSession.location} is cancelled on{" "}
                                {cancelledClasses.map((date) => (
                                  <p className="bg-white mb-1 text-center">
                                    {date}
                                  </p>
                                ))}
                              </small>
                            </ListGroupItem>
                            <ListGroupItem></ListGroupItem>
                          </>
                        )
                      );
                    })}
                </ListGroup>
              </>
            </Col>
          </Row>
        )}
        <div className="p-5 bg-primary text-white">
          <p className="text-white">
            Not sure which class is best for you? Search for relevant classes
          </p>
          <div className="mb-3 border-bottom border-warning">
            <Form onSubmit={onSubmit}>
              <Row className="py-2 mx-1">
                <Col md={5} className="mb-1">
                  <Form.Control
                    as="select"
                    value={ageGroup}
                    onChange={handleAgeGroup}
                  >
                    <option value="under9">Aged under 9 years old</option>

                    <option value="9andover">Aged 9 years old or above</option>
                  </Form.Control>
                </Col>

                <Col md={5} className="mb-1">
                  <Form.Control
                    as="select"
                    value={grade}
                    onChange={handleGrade}
                  >
                    <option value="16">Beginner</option>
                    <option value="15">15 kyu</option>
                    <option value="14">14 kyu</option>
                    <option value="13">13 kyu</option>
                    <option value="12">12 kyu</option>
                    <option value="11">11 kyu</option>
                    <option value="10">10 kyu</option>
                    <option value="9">9 kyu</option>
                    <option value="8">8 kyu</option>
                    <option value="7">7 kyu</option>
                    <option value="6">6 kyu</option>
                    <option value="5">5 kyu</option>
                    <option value="4">4 kyu</option>
                    <option value="3">3 kyu</option>
                    <option value="2">2 kyu</option>
                    <option value="1">1 kyu</option>
                    <option value="0">Black belt</option>
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button variant="default" type="submit" className="w-100">
                    <i className="fas fa-search"></i>
                  </Button>
                </Col>
              </Row>
            </Form>
            <p>What is a kyu grade?</p>
            <p>
              A kyu, in Japanese martial arts, designates grade (level) of
              proficiency. The levels go in reverse, that is to say that 1st kyu
              is the highest and 15th kyu the lowest. When black belt is
              achieved, the rank system switches to dan and counts up. 1st dan
              is the first level of black belt and 10th dan is the highest
              level. <br />
              Every kyu grade has a different belt colour, unlike dan grades
              that are all black.
            </p>
            <Button
              variant="default"
              className="py-0 mb-2"
              onClick={handleShowKyu}
            >
              See the different kyu colours
            </Button>
          </div>
        </div>
      </Container>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-center text-white">
            Class Search
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <p>The classes that are most suitable for you are:</p>
          {classList &&
            classList.map((session) => (
              <Card className="mb-2" key={session._id}>
                <Card.Body>
                  <Card.Title className="mb-1 text-warning">
                    {session.name} Class
                  </Card.Title>
                  <Card.Subtitle className="text-muted">
                    {session.times}
                  </Card.Subtitle>
                  <Card.Text>{session.location}</Card.Text>
                </Card.Body>
                <Card.Footer className="border-bottom border-warning mb-2">
                  Number of places available:{" "}
                  {session.capacity - session.numberBooked}
                </Card.Footer>
              </Card>
            ))}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button onClick={() => setShow(false)} variant="default">
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showKyu} onHide={handleCloseKyu}>
        <Modal.Header className="text-white bg-dark" closeButton>
          <Modal.Title className="text-white">Kyu (grade)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        <Modal.Footer className="bg-dark text-white">
          <Button onClick={handleCloseKyu} variant="default">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimetableScreen;
