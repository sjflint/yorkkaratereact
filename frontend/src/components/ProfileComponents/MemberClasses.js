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
import { listFinancials } from "../../actions/financialActions";
import { ATTENDANCE_MEMBER_LIST_RESET } from "../../constants/attendanceConstants";
import AttRecord from "../AttRecord";

const MemberClasses = () => {
  const dispatch = useDispatch();
  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;
  // Modals
  const [addClass, setAddClass] = useState(false);
  const [deleteClass, setDeleteClass] = useState(false);
  const [switchClass, setSwitchClass] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [attRecordModal, setAttRecordModal] = useState(false);

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

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

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

  const getAge = (birthDate) =>
    Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);

  useEffect(() => {
    dispatch(listTrainingSessions());
    dispatch(listMyClasses());
    dispatch(listFinancials());
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

  // get age
  const memberAge = getAge(member.dateOfBirth);
  if (filteredSessions && member) {
    filteredSessions = filteredSessions.filter((trainingSessions) => {
      if (memberAge < 9 && member.kyuGrade > 10) {
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
      <h2 className="border-bottom border-warning mt-2 text-warning text-center">
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
                    <p className="text-center pb-0">{session.name}</p>
                    <p>{session.times}</p>
                  </div>
                </Col>

                <Col md={7}>
                  {canSwitch === false ? (
                    <div className="d-flex justify-content-around">
                      <Button className="btn-sm" disabled>
                        <i className="fas fa-exchange-alt"></i> Switch Class
                      </Button>

                      <Button variant="danger" className="btn-sm" disabled>
                        <i className="fas fa-trash"></i> Delete Class
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-around">
                      <Button
                        className="btn-sm"
                        onClick={() => switchHandler(session)}
                      >
                        <i className="fas fa-exchange-alt"></i> Switch Class
                      </Button>

                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(session)}
                      >
                        <i className="fas fa-trash"></i> Delete Class
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <div className="btn btn-link" onClick={() => setAddClass(true)}>
        <i className="fas fa-plus"></i> Add New Class
      </div>
      {canSwitch === false && (
        <p className="text-warning text-center mt-4">
          Unable to switch or delete classes again until:
          <br />
          {`${String(changeDate).substring(7, 10)}
      ${String(changeDate).substring(4, 8)} ${String(changeDate).substring(
            10,
            15
          )}`}
        </p>
      )}
      <div className="py-4 border-bottom border-warning">
        <div
          onClick={() => {
            dispatch({ type: ATTENDANCE_MEMBER_LIST_RESET });
            setAttRecordModal(true);
          }}
          className="btn btn-link"
        >
          <i className="fa-solid fa-eye"></i>{" "}
          <small>View Attendance Record</small>
        </div>
      </div>

      {/* Add Class Modal */}
      <Modal
        show={addClass}
        onHide={() => setAddClass(false)}
        dialogClassName="modal-90w"
        aria-labelledby="add-class"
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title id="add-class" className="text-white">
            <i className="fas fa-plus"></i> Add Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Your current monthly training fees are: £
            {(member.trainingFees / 100).toFixed(2)}
          </h5>
          {financialsLoading ? (
            <Loader variant="warning" />
          ) : financialsError ? (
            <Message>{financialsError}</Message>
          ) : (
            <h5>
              Your monthly training fees will increase by:{" "}
              {sessions && sessions.length === 0
                ? "£0.00"
                : `£${(financials.costOfAdditionalClass / 100).toFixed(2)}`}
            </h5>
          )}
          <Row>
            {filteredSessions &&
              filteredSessions.map((session) => (
                <Col md={6} className="mb-3" key={session._id}>
                  <Card>
                    <Card.Header className="bg-primary text-white">
                      {session.name}
                    </Card.Header>
                    <Card.Body className="bg-light text-primary">
                      <Card.Subtitle className="mb-2">
                        {session.times}
                      </Card.Subtitle>
                      <Card.Text>{session.location}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-light">
                      {session.participants.length === session.capacity ? (
                        <Button disabled>Class Fully Booked</Button>
                      ) : (
                        <>
                          {buttonLoader ? (
                            <Button disabled>Add Class</Button>
                          ) : (
                            <Button
                              onClick={() => addClassToList(session._id)}
                              variant="warning"
                            >
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
        <Modal.Footer className="bg-dark">
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
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title id="delete-class" className="text-white">
            <i className="fas fa-trash"></i> Delete Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <ListGroup variant="flush text-center">
            <ListGroup.Item>
              <p>{sessionToDelete.name}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                {sessionToDelete.location}
                <br />
                {sessionToDelete.times}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p className="mt-3">
                This class will be removed from your list of classes and your
                direct debit adjusted accordingly
              </p>
            </ListGroup.Item>
          </ListGroup>
          <small className="text-danger">
            Please note that you can only switch/delete one class per month.
            This action cannot be undone.
          </small>
        </Modal.Body>
        <Modal.Footer className="bg-light text-primary">
          {buttonLoader ? (
            <Button variant="danger" disabled>
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
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title id="switch-class" className="text-white">
            <i className="fas fa-exchange-alt"></i> Switch Class
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <Card className="mb-3">
            <Card.Header className="bg-secondary">
              {sessionToDelete.name}
            </Card.Header>
            <Card.Body className="bg-light text-primary">
              <Card.Subtitle className="mb-2">
                {sessionToDelete.times}
              </Card.Subtitle>
              <Card.Text>{sessionToDelete.location}</Card.Text>
            </Card.Body>
          </Card>
          <small className="text-center text-danger">
            Please note that you can only switch/delete one class per month.
            This action cannot be undone.
          </small>
          <p className="mt-2">
            Please choose your replacement class from below:
          </p>
          <Row>
            {filteredSessions &&
              filteredSessions.map((session) => (
                <Col md={6} className="mb-3" key={session._id}>
                  <Card>
                    <Card.Header className="bg-secondary">
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
                        <Button disabled className="btn-sm">
                          Class Fully Booked
                        </Button>
                      ) : (
                        <Button
                          className="btn-sm w-100"
                          onClick={() =>
                            actionSwitchClass(sessionToDelete._id, session._id)
                          }
                        >
                          <i className="fas fa-exchange-alt"></i> Confirm class
                          switch
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

      {/* record modal */}
      <Modal
        show={attRecordModal}
        onHide={() => setAttRecordModal(false)}
        aria-labelledby="title-sm"
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title id="title-sm" className="text-white">
            Attendance Record
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">Attendance Record</p>
          {/* att Record */}
          <AttRecord id={member._id} numRecords={-5} />
          <Modal.Footer>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => {
                setAttRecordModal(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MemberClasses;
