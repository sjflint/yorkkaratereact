import { useEffect, useState } from "react";
import { listGrading } from "../actions/gradingActions";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Container,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import logo from "../img/logo2021a.png";

const GradingScreen = ({ match, history }) => {
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const displayGrading = useSelector((state) => state.displayGrading);
  const { loadingGrading, error, grading } = displayGrading;

  useEffect(() => {
    if (!memberInfo || !memberInfo.isInstructor) {
      history.push(
        `/login?redirect=instructor/gradingdetails/${match.params.id}`
      );
    } else {
      dispatch(listGrading(match.params.id));
    }
  }, [dispatch, memberInfo, history, match.params.id]);

  const dateToday = Date.now();

  if (grading) {
    grading.participants.sort((a, b) =>
      a.grade > b.grade ? -1 : b.grade < a.grade ? 1 : 0
    );
  }

  return (
    <Container fluid="lg">
      {loadingGrading && <Loader variant="warning" />}
      {error && <Message variant="danger">{error}</Message>}
      {grading && (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            {grading.title}
          </h3>
          <Row className="bg-primary align-items-center p-3">
            <Col md={6}>
              <img src={grading.image} alt="grading" />
            </Col>
            <Col md={6} className="text-center">
              <ListGroup>
                <ListGroup.Item>Grading Title: {grading.title}</ListGroup.Item>
                <ListGroup.Item>
                  Grading Date:{" "}
                  {new Date(grading.dateOfEvent).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>Location: {grading.location}</ListGroup.Item>
                <ListGroup.Item>
                  Number of participants: {grading.participants.length}
                </ListGroup.Item>
              </ListGroup>
              <button
                className="btn btn-lg btn-default mt-4"
                onClick={() => setShowModal(true)}
              >
                Start Grading Examination
              </button>
            </Col>
          </Row>
          <h5 className="my-3 border-bottom border-warning text-center">
            Participants
          </h5>
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>Name</th>
                <th>Current Grade</th>
                <th>JKS license number</th>
                <th>Age (as of today)</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {grading.participants.map((member) => {
                // Calculate current age, as of today
                const age = (
                  (dateToday - Date.parse(member.dateOfBirth)) /
                  31556952000
                ).toFixed(0);
                return (
                  <tr key={member._id} className="text-center">
                    <td>{`${member.firstName} ${member.lastName}`}</td>
                    {member.grade === 1 ? (
                      <td>{member.grade}st kyu</td>
                    ) : member.grade === 2 ? (
                      <td>{member.grade}nd kyu</td>
                    ) : member.grade === 3 ? (
                      <td>{member.grade}rd kyu</td>
                    ) : (
                      <td>{member.grade}th kyu</td>
                    )}
                    <td>{member.licenseNumber}</td>
                    <td>{age}</td>
                    <td>
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    </td>
                    <td>
                      <a href={`tel:0${member.phone}`}>{`0${member.phone}`}</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Start Grading</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-dark text-center">
          <img src={logo} alt="logo" />
          Would you like to start the grading examination? <br />
          This will launch the grading app
        </Modal.Body>
        <Modal.Footer className="bg-primary">
          <button
            className="btn btn-default btn-block"
            onClick={() => setShowModal(false)}
          >
            Start
          </button>
          <Button
            variant="secondary"
            className="btn-block"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GradingScreen;
