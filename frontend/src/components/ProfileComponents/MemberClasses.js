import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addMyClass,
  deleteMyClass,
  switchMyClass,
  listMyClasses,
  listTrainingSessions,
} from "../../actions/trainingSessionActions";
import { getMemberDetails } from "../../actions/memberActions";
import dojoImg from "../../img/dojo.jpeg";
import Loader from "../Loader";
import Message from "../Message";

const MemberClasses = () => {
  const dispatch = useDispatch();
  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;
  // Modals
  const [addClass, setAddClass] = useState(false);
  const [deleteClass, setDeleteClass] = useState(false);
  const [switchClass, setSwitchClass] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const [sessionToDelete, setSessionToDelete] = useState({});

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { trainingSessions } = trainingSessionsList;

  const myClassList = useSelector((state) => state.myClassList);
  const {
    loading: classListLoading,
    error: classListError,
    sessions,
  } = myClassList;

  // Check for delete/switch eligibility
  let changeDate;
  if (member) {
    changeDate = new Date(member.lastClassChange);
    changeDate.setDate(changeDate.getDate() - 1);
    changeDate.setMonth(changeDate.getMonth() + 1);
  }
  const today = new Date();
  let canSwitch;
  if (changeDate < today) {
    canSwitch = true;
  } else {
    canSwitch = false;
  }

  useEffect(() => {
    dispatch(listTrainingSessions());
    dispatch(listMyClasses());
  }, [dispatch]);

  // Filter classes to only what is relevant
  let filteredSessions = trainingSessions;
  if (sessions) {
    sessions.forEach((session) => {
      filteredSessions = filteredSessions.filter((trainingSessions) => {
        if (trainingSessions._id === session._id) {
          return false;
        } else {
          return true;
        }
      });
    });
  }

  if (filteredSessions && member) {
    filteredSessions = filteredSessions.filter((trainingSessions) => {
      if (member.age < 9) {
        return trainingSessions.juniorSession === true;
      } else if (
        member.kyuGrade <= trainingSessions.minGradeLevel &&
        member.kyuGrade >= trainingSessions.maxGradeLevel &&
        trainingSessions.juniorSession === false
      ) {
        return true;
      } else {
        return false;
      }
    });
  }

  //  Add session
  const addClassToList = async (classId) => {
    setButtonLoader(true);
    const id = { memberId: member._id, classId: classId, classList: sessions };
    await dispatch(addMyClass(id));
    await dispatch(listMyClasses());
    await dispatch(getMemberDetails("profile"));
    await setAddClass(false);
    setButtonLoader(false);
  };

  // Delete session
  const deleteHandler = (session) => {
    setSessionToDelete(session);
    setDeleteClass(true);
  };

  const confirmDeleteClass = async (classId) => {
    setButtonLoader(true);
    const id = { memberId: member, classId: classId };
    await dispatch(deleteMyClass(id));
    await dispatch(listMyClasses());
    await dispatch(getMemberDetails("profile"));
    setDeleteClass(false);
    setButtonLoader(false);
  };

  // switch session
  const switchHandler = (deleteSession) => {
    setSessionToDelete(deleteSession);
    setSwitchClass(true);
  };

  const actionSwitchClass = async (sessionToDelete, sessionToAdd) => {
    const id = {
      memberId: member,
      deleteId: sessionToDelete,
      addId: sessionToAdd,
    };
    await dispatch(switchMyClass(id));
    await dispatch(listMyClasses());
    await dispatch(getMemberDetails("profile"));
    setSwitchClass(false);
  };

  return (
    <>
      <img src={dojoImg} alt="dojo" />
      <h2 className="border-bottom border-warning mt-2 text-warning">
        Your class bookings
      </h2>
      {classListLoading ? (
        <Loader variant="warning" />
      ) : classListError ? (
        <Message variant="danger">{classListError}</Message>
      ) : sessions.length === 0 ? (
        <h5 className="text-warning">No Classes booked</h5>
      ) : (
        <ListGroup variant="flush">
          {sessions.map((session) => (
            <ListGroup.Item bg="light" key={session._id}>
              <Row className="align-items-center text-center">
                <Col md={4}>
                  <div>
                    <h5 className="text-center pb-0">{session.name}</h5>
                  </div>
                </Col>
                <Col md={4}>
                  {session.location}
                  <br />
                  {session.times}
                </Col>
                <Col md={4}>
                  {canSwitch === false ? (
                    <Row noGutters>
                      <Col md={6}>
                        <Button className="btn-block px-1" disabled>
                          <i className="fas fa-exchange-alt"></i>
                          <br /> Switch Class
                        </Button>
                      </Col>

                      <Col md={6}>
                        <Button
                          variant="danger"
                          className="btn-block px-1"
                          disabled
                        >
                          <i className="fas fa-trash"></i>
                          <br /> Delete Class
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    <Row noGutters>
                      <Col md={6}>
                        <Button
                          className="btn-block px-1"
                          onClick={() => switchHandler(session)}
                        >
                          <i className="fas fa-exchange-alt"></i>
                          <br /> Switch Class
                        </Button>
                      </Col>

                      <Col md={6}>
                        <Button
                          variant="danger"
                          className="btn-block px-1"
                          onClick={() => deleteHandler(session)}
                        >
                          <i className="fas fa-trash"></i>
                          <br /> Delete Class
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Button
        className="btn-block btn btn-warning"
        onClick={() => setAddClass(true)}
      >
        <i className="fas fa-plus"></i> Add New Class
      </Button>
      {canSwitch === false && (
        <h5 className="text-warning text-center mt-4">
          Unable to switch or delete classes again until:
          <br />
          {`${String(changeDate).substring(7, 10)}
      ${String(changeDate).substring(4, 8)} ${String(changeDate).substring(
            10,
            15
          )}`}
        </h5>
      )}

      {/* Add Class Modal */}
      <Modal
        show={addClass}
        onHide={() => setAddClass(false)}
        dialogClassName="modal-90w"
        aria-labelledby="add-class"
      >
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title id="add-class">
            <i className="fas fa-plus"></i> Add Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <h5>
            Your current monthly training fees are: £
            {(member.membershipLevel / 100).toFixed(2)}
          </h5>
          <h5>
            Your monthly training fees will increase by:{" "}
            {sessions && sessions.length === 0 ? "£0.00" : "£3.00"}
          </h5>
          <Row>
            {filteredSessions &&
              filteredSessions.map((session) => (
                <Col md={6} className="mb-3" key={session._id}>
                  <Card>
                    <Card.Header className="bg-secondary text-white">
                      {session.name}
                    </Card.Header>
                    <Card.Body className="bg-light text-primary">
                      <Card.Subtitle className="mb-2">
                        {session.times}
                      </Card.Subtitle>
                      <Card.Text>{session.location}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-light text-primary">
                      {session.participants.length === session.capacity ? (
                        <Button disabled>Class Fully Booked</Button>
                      ) : (
                        <>
                          {buttonLoader ? (
                            <Button disabled>Add Class</Button>
                          ) : (
                            <Button onClick={() => addClassToList(session._id)}>
                              Add Class
                            </Button>
                          )}
                        </>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          {buttonLoader && <Loader />}
          <Button variant="secondary" onClick={() => setAddClass(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Class Modal */}
      <Modal
        show={deleteClass}
        onHide={() => setDeleteClass(false)}
        dialogClassName="modal-90w"
        aria-labelledby="delete-class"
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title id="delete-class">
            <i className="fas fa-trash"></i> Delete Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <h5>Are you sure you wish to delete the following class:</h5>
          <h5 variant="flush">{sessionToDelete.name}</h5>

          <p>
            {sessionToDelete.location}
            <br />
            {sessionToDelete.times}
          </p>

          <p className="mt-3">
            This class will be removed from your list of classes and your direct
            debit adjusted accordingly
          </p>
          <h5 className="text-center text-danger">
            Please note that you can only switch/delete one class per month.
            This action cannot be undone.
          </h5>
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          {buttonLoader ? (
            <Button variant="danger" disbaled>
              <h5>
                <Loader />
              </h5>
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={() => confirmDeleteClass(sessionToDelete._id)}
              >
                <i className="fas fa-trash"></i> Delete
              </Button>
              <Button variant="secondary" onClick={() => setDeleteClass(false)}>
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Switch Class Modal */}
      <Modal
        show={switchClass}
        onHide={() => setSwitchClass(false)}
        dialogClassName="modal-90w"
        aria-labelledby="switch-class"
      >
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title id="switch-class">
            <i className="fas fa-exchange-alt"></i> Switch Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <h5>
            The class below will be removed from your class list and you will
            not be able to attend in the future:
          </h5>

          <Card className="mb-3">
            <Card.Header className="bg-secondary text-white">
              {sessionToDelete.name}
            </Card.Header>
            <Card.Body className="bg-light text-primary">
              <Card.Subtitle className="mb-2">
                {sessionToDelete.times}
              </Card.Subtitle>
              <Card.Text>{sessionToDelete.location}</Card.Text>
            </Card.Body>
          </Card>
          <h5 className="text-center text-danger">
            Please note that you can only switch/delete one class per month.
            This action cannot be undone.
          </h5>
          <h5>Please choose your replacement class from below:</h5>
          <Row>
            {filteredSessions &&
              filteredSessions.map((session) => (
                <Col md={6} className="mb-3" key={session._id}>
                  <Card>
                    <Card.Header className="bg-secondary text-white">
                      {session.name}
                    </Card.Header>
                    <Card.Body className="bg-light text-primary">
                      <Card.Subtitle className="mb-2">
                        {session.times}
                      </Card.Subtitle>
                      <Card.Text>{session.location}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-light text-primary">
                      {session.participants.length === session.capacity ? (
                        <Button disabled>Class Fully Booked</Button>
                      ) : (
                        <Button
                          onClick={() =>
                            actionSwitchClass(sessionToDelete._id, session._id)
                          }
                        >
                          <i className="fas fa-exchange-alt"></i> Switch Class
                        </Button>
                      )}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          <Button variant="secondary" onClick={() => setSwitchClass(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberClasses;
