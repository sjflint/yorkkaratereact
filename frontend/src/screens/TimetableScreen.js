import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
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

  return (
    <>
      <Container fluid="lg">
        <h3 className="text-center border-bottom border-warning pb-1">
          Timetable
        </h3>

        <h5>
          Not sure which class is best for you? Search for a relevant classes
        </h5>
        <Form
          className="pb-3 mb-3 border-bottom border-warning"
          onSubmit={onSubmit}
        >
          <Row className="bg-primary py-2 mx-1">
            <Col md={5} className="mb-1">
              <Form.Control
                as="select"
                placeholder="Age Group"
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
                placeholder="Grade Level"
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
              <Button
                variant="primary"
                type="submit"
                className="btn-lg btn-block"
              >
                <i className="fas fa-search text-warning"></i>
              </Button>
            </Col>
          </Row>
          <p
            className="text-warning mt-1 text-link mb-0 d-inline"
            onClick={handleShowKyu}
          >
            What is a 'kyu' grade?
          </p>
        </Form>

        {loading ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading timetable">
            {error}
          </Message>
        ) : (
          <>
            <Image src={ImgStChads} alt="monday dojo" />
            <TrainingSession
              trainingSessions={trainingSessions}
              trainingDay={"Monday"}
            />
            <Image
              src={ImgJoRo}
              alt="monday dojo"
              className="mt-3 border-top border-warning pt-3"
            />
            <TrainingSession
              trainingSessions={trainingSessions}
              trainingDay={"Tuesday"}
            />
            <Image
              src={ImgJoRo}
              alt="monday dojo"
              className="mt-3 border-top border-warning pt-3"
            />
            <TrainingSession
              trainingSessions={trainingSessions}
              trainingDay={"Wednesday"}
            />
            <Image
              src={ImgArchHol}
              alt="monday dojo"
              className="mt-3 border-top border-warning pt-3"
            />
            <TrainingSession
              trainingSessions={trainingSessions}
              trainingDay={"Thursday"}
            />
            <Image
              src={ImgStrensall}
              alt="monday dojo"
              className="mt-3 border-top border-warning pt-3"
            />
            <TrainingSession
              trainingSessions={trainingSessions}
              trainingDay={"Friday"}
            />
            <Image
              src={ImgStrensall}
              alt="monday dojo"
              className="mt-3 border-top border-warning pt-3"
            />
            <TrainingSession
              trainingSessions={trainingSessions}
              trainingDay={"Saturday"}
            />
          </>
        )}
      </Container>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton className="text-white bg-secondary">
          <Modal.Title className="text-center">
            Your ability level is
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <h5>The classes that are most suitable for you are:</h5>
          {classList &&
            classList.map((session) => (
              <Card className="mb-2" key={session._id}>
                <Card.Body className="bg-light text-primary">
                  <Card.Title>{session.name} Class</Card.Title>
                  <Card.Subtitle className="text-muted">
                    {session.times}
                  </Card.Subtitle>
                  <Card.Text>{session.location}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-light text-primary">
                  Number of places available:{" "}
                  {session.capacity - session.numberBooked}
                </Card.Footer>
              </Card>
            ))}
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          <Button onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showKyu} onHide={handleCloseKyu}>
        <Modal.Header className="text-white bg-secondary" closeButton>
          <Modal.Title>Kyu (grade)</Modal.Title>
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

export default TimetableScreen;
