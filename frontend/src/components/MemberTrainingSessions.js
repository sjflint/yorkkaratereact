import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listFinancials } from "../actions/financialActions";
import {
  addMyClass,
  deleteMyClass,
  switchMyClass,
  listTrainingSessions,
  listMemberClasses,
} from "../actions/trainingSessionActions";
import Loader from "./Loader";
import Message from "./Message";

const MemberTrainingSessions = () => {
  const dispatch = useDispatch();
  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;
  // Modals
  const [addClass, setAddClass] = useState(false);
  const [deleteClass, setDeleteClass] = useState(false);
  const [switchClass, setSwitchClass] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const [sessionToDelete, setSessionToDelete] = useState({});

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { trainingSessions } = trainingSessionsList;

  const memberClassList = useSelector((state) => state.memberClassList);
  const {
    loading: classListLoading,
    error: classListError,
    sessions,
  } = memberClassList;

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

  const addClassList = useSelector((state) => state.addClassList);
  const { error: addClassError } = addClassList;

  // Check for delete/switch eligibility
  let changeDate;
  if (member) {
    changeDate = new Date(member.lastClassChange);
    changeDate.setDate(changeDate.getDate() - 1);
    changeDate.setMonth(changeDate.getMonth() + 1);
  }
  const today = new Date();
  let canSwitch;
  if (changeDate < today || memberInfo.isAdmin) {
    canSwitch = true;
  } else {
    canSwitch = false;
  }

  // Filter classes to only what is relevant
  let filteredSessions = trainingSessions;

  if (sessions) {
    sessions.forEach((session) => {
      filteredSessions = filteredSessions.filter((trainingSession) => {
        if (trainingSession._id === session._id) {
          return false;
        } else {
          return true;
        }
      });
    });

    // calculate age
    const getAge = (birthDate) =>
      Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

    if (filteredSessions && member) {
      // get age
      const memberAge = getAge(member.dateOfBirth);
      filteredSessions = filteredSessions.filter((trainingSession) => {
        if (memberAge < 8 && member.kyuGrade > 10) {
          return trainingSession.juniorSession === true;
        } else if (
          memberAge < 9 &&
          member.kyuGrade <= trainingSession.minGradeLevel &&
          member.kyuGrade >= trainingSession.maxGradeLevel
        ) {
          return true;
        } else if (
          member.kyuGrade <= trainingSession.minGradeLevel &&
          member.kyuGrade >= trainingSession.maxGradeLevel &&
          trainingSession.juniorSession === false
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  useEffect(() => {
    dispatch(listTrainingSessions());
    dispatch(listFinancials());
  }, [dispatch]);

  //  Add session
  const addClassToList = async (classId) => {
    setButtonLoader(true);
    const id = { memberId: member._id, classId: classId, classList: sessions };
    await dispatch(addMyClass(id));
    await dispatch(listMemberClasses(id.memberId));

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
    const id = { memberId: member, classId: classId, adminId: memberInfo._id };
    await dispatch(deleteMyClass(id));
    await dispatch(listMemberClasses(id.memberId._id));

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
      adminId: memberInfo._id,
    };
    await dispatch(switchMyClass(id));
    await dispatch(listMemberClasses(id.memberId._id));

    setSwitchClass(false);
  };

  return (
    <>
      {classListLoading ? (
        <Loader variant="warning" />
      ) : classListError ? (
        <Message variant="danger">{classListError}</Message>
      ) : addClassError ? (
        <Message variant="danger">
          Class could not be added at this time. Please try again later or
          contact admin on info@yorkkarate.net
        </Message>
      ) : sessions.length === 0 ? (
        <p className="text-warning">No Classes booked</p>
      ) : (
        <>
          <ListGroup variant="flush" className="mb-2 bg-light">
            {sessions !== "No classes found" &&
              sessions.map((session) => (
                <ListGroup.Item className="bg-light mb-1" key={session._id}>
                  <Row className="align-items-center text-center">
                    <Col md={5}>
                      <div>
                        <div className="text-center pb-0">
                          <p>{session.name}</p>
                          <p>{session.times}</p>
                        </div>
                      </div>
                    </Col>

                    <Col md={7}>
                      {canSwitch === false ? (
                        <div className="d-flex justify-content-around">
                          <Button className="btn-sm" variant="primary" disabled>
                            <i className="fas fa-exchange-alt"></i> Switch Class
                          </Button>

                          <Button variant="danger" className="btn-sm" disabled>
                            <i className="fas fa-trash"></i> Delete Class
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-around">
                          <Button
                            variant="primary"
                            className="btn-block px-1"
                            onClick={() => switchHandler(session)}
                          >
                            <i className="fas fa-exchange-alt"></i>
                            <br /> Switch Class
                          </Button>

                          <Button
                            variant="danger"
                            className="btn-block px-1"
                            onClick={() => deleteHandler(session)}
                          >
                            <i className="fas fa-trash"></i>
                            <br /> Delete Class
                          </Button>
                        </div>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </>
      )}
      <Button
        variant="outline-secondary"
        className="d-block mb-2 py-0"
        onClick={() => {
          setAddClass(true);
        }}
      >
        <i className="fas fa-plus"></i> Add New Class
      </Button>
      {canSwitch === false && (
        <small className="text-warning text-center">
          Unable to switch or delete classes again until:
          <br />
          {`${String(changeDate).substring(7, 10)}
      ${String(changeDate).substring(4, 8)} ${String(changeDate).substring(
            10,
            15
          )}`}
        </small>
      )}

      {/* Add Class Modal */}
      <Modal
        show={addClass}
        onHide={() => setAddClass(false)}
        dialogClassName="modal-90w"
        aria-labelledby="add-class"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title id="add-class" className="text-white">
            <i className="fas fa-plus"></i> Add Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Current monthly training fees are: £
            {(member.trainingFees / 100).toFixed(2)}
          </p>
          <p>
            Monthly training fees will increase by:{" "}
            {sessions && sessions.length === 0
              ? "£0.00"
              : financials
              ? (financials.costOfAdditionalClass / 100).toLocaleString(
                  "en-GB",
                  {
                    style: "currency",
                    currency: "GBP",
                  }
                )
              : null}
          </p>
          <Row>
            {filteredSessions &&
              filteredSessions.map((session) => (
                <Col md={6} className="mb-3" key={session._id}>
                  <Card className="h-100">
                    <Card.Header>{session.name}</Card.Header>
                    <Card.Body>
                      <Card.Subtitle className="mb-2">
                        {session.times}
                      </Card.Subtitle>
                      <Card.Text>{session.location}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      {session.participants.length +
                        session.trialParticipants.length >=
                      session.capacity ? (
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
        <Modal.Footer className="bg-primary text-light">
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
          <p>Are you sure you wish to delete the following class:</p>
          <p variant="flush">{sessionToDelete.name}</p>

          <p>
            {sessionToDelete.location}
            <br />
            {sessionToDelete.times}
          </p>

          <p className="mt-3">
            This class will be removed from your list of classes and your direct
            debit adjusted accordingly
          </p>
          <p className="text-center text-danger">
            Please note that you can only switch/delete one class per month.
            This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          {buttonLoader ? (
            <Button variant="danger" disbaled>
              <p>
                <Loader />
              </p>
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
            <i className="fas fa-exchange-alt"></i> Permanently Switch Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <p>
            The class below will be permanently removed from your class list and
            you will not be able to attend in the future:
          </p>

          <Card className="mb-3">
            <Card.Header className="bg-grey">
              {sessionToDelete.name}
            </Card.Header>
            <Card.Body className="bg-light text-primary">
              <Card.Subtitle className="mb-2">
                {sessionToDelete.times}
              </Card.Subtitle>
              <Card.Text>{sessionToDelete.location}</Card.Text>
            </Card.Body>
          </Card>
          <p className="text-center text-danger">
            Please note that you can only switch/delete one class per month.
            This action cannot be undone.
          </p>
          <p className="text-center text-danger">
            If you are looking to attend a one-off class, you do not need to
            book. Simply turn-up for the session at the required time.
          </p>
          <p>Please choose your replacement class from below:</p>
          <Row>
            {filteredSessions &&
              filteredSessions.map((session) => (
                <Col md={6} className="mb-3" key={session._id}>
                  <Card>
                    <Card.Header className="bg-grey">
                      {session.name}
                    </Card.Header>
                    <Card.Body className="bg-light text-primary">
                      <Card.Subtitle className="mb-2">
                        {session.times}
                      </Card.Subtitle>
                      <Card.Text>{session.location}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-grey">
                      {session.participants.length +
                        session.trialParticipants.length >=
                      session.capacity ? (
                        <Button disabled>Class Fully Booked</Button>
                      ) : (
                        <Button
                          variant="warning"
                          className="btn-link"
                          onClick={() =>
                            actionSwitchClass(sessionToDelete._id, session._id)
                          }
                        >
                          <i className="fas fa-exchange-alt"></i> Permanently
                          Switch Class
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

export default MemberTrainingSessions;
