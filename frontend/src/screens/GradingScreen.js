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
import { Link } from "react-router-dom";
import axios from "axios";

const GradingScreen = ({ match, history }) => {
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [beltModal, setBeltModal] = useState(false);

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

  if (grading && grading.title) {
    grading.participants.sort((a, b) =>
      a.grade > b.grade ? -1 : b.grade < a.grade ? 1 : 0
    );
  }

  let beltsToOrder = 0;
  let keys;
  if (grading && grading.title) {
    Object.values(grading.beltsToOrder).forEach((val) => {
      if (val !== "Fully Stocked") {
        beltsToOrder = beltsToOrder + val;
      }
    });

    keys = Object.keys(grading.beltsToOrder);
  }

  const deleteHandler = async () => {
    console.log(deleteId);
    const idToDelete = {
      id: `${deleteId}`,
      eventId: grading._id,
    };
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };
      await axios.put("/api/events/delete", idToDelete, config).then(() => {
        setDeleteSuccess(true);
        dispatch(listGrading(match.params.id));
        setShow(false);
        window.scrollTo(0, 0);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container fluid="lg" className="mt-3">
      {deleteSuccess && (
        <Message variant="success">Member removed from grading</Message>
      )}
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
                  Number of participants:{" "}
                  {grading.participants && grading.participants.length}
                  {/* How to calculate number of participants */}
                </ListGroup.Item>
                {beltsToOrder > 0 && (
                  <ListGroup.Item variant="danger">
                    <Button variant="danger" onClick={() => setBeltModal(true)}>
                      Belts need to be ordered
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
              <Button
                className="btn-default mt-4"
                onClick={() =>
                  history.push(`/instructor/grading/${grading._id}`)
                }
              >
                Grading Results
              </Button>
            </Col>
          </Row>
          <h5 className="my-3 border-bottom border-warning text-center">
            Participants
          </h5>
          <Table striped bordered hover responsive>
            <thead className="bg-primary text-light">
              <tr className="text-center">
                <th>Name</th>
                <th>Current Grade</th>
                <th>JKS license number</th>
                <th>Age (as of today)</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {grading.title &&
                grading.participants.map((member) => {
                  const DofB = new Date(member.dateOfBirth);
                  // Calculate current age, as of today
                  const diff_ms = Date.now() - DofB.getTime();
                  const age_dt = new Date(diff_ms);
                  const age = Math.abs(age_dt.getFullYear() - 1970);

                  return (
                    <tr key={member._id} className="text-center">
                      <td>
                        {" "}
                        <Link
                          to={`/admin/members/${member._id}/edit`}
                        >{`${member.firstName} ${member.lastName}`}</Link>
                      </td>

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
                        <a
                          href={`tel:0${member.phone}`}
                        >{`0${member.phone}`}</a>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => {
                            setShow(true);
                            setDeleteId(member._id);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>

          <h5 className="my-3 border-bottom border-warning text-center">
            Training Course Participants
          </h5>
          <Table striped bordered hover>
            <thead>
              <tr className="text-center">
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {grading.title && grading.trainingParticipants.length === 0 ? (
                <tr>
                  <td className="text-center text-danger">
                    No Training Course Participants
                  </td>
                </tr>
              ) : (
                grading.title &&
                grading.trainingParticipants.map((member) => {
                  return (
                    <tr key={member._id} className="text-center">
                      <td>{`${member.firstName} ${member.lastName}`}</td>
                      <td>
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </td>
                      <td>
                        <a
                          href={`tel:0${member.phone}`}
                        >{`0${member.phone}`}</a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={beltModal} onHide={() => setBeltModal(false)}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Belts To Order</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-dark text-center">
          {keys &&
            keys.map((key, index) => (
              <ListGroup.Item
                key={index}
              >{`${key} : ${grading.beltsToOrder[key]}`}</ListGroup.Item>
            ))}
        </Modal.Body>
        <Modal.Footer className="bg-primary">
          <Button
            variant="secondary"
            className="btn-block"
            onClick={() => setBeltModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Member?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will remove the member from the grading examination. This
          action is not reversable.
          <hr />
          PLEASE NOTE: This action will not issue a refund to the member. This
          should be handled seperately.
          <br /> Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GradingScreen;
