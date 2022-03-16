import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  listTrainingSessions,
  updateTrainingSession,
} from "../actions/trainingSessionActions";
import {
  attendeeAdd,
  attendeeRemove,
  updateAttendance,
} from "../actions/attendanceActions";

const AttendanceScreen = ({ history }) => {
  const [participants, setParticipants] = useState([]);

  const dayToday = () => {
    const d = new Date();
    const day = d.getDay();
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
      default:
        return "Error - Unknown day";
    }
  };

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const attendanceList = useSelector((state) => state.attendanceList);
  const {
    loading: attendanceLoading,
    error: attendanceError,
    record,
  } = attendanceList;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      dispatch(listTrainingSessions());
    }
  }, [dispatch, history, memberInfo]);

  let todaysClasses;

  const todaysDate = new Date().toDateString();
  const day = dayToday().substring(0, 3);
  if (trainingSessions) {
    todaysClasses = trainingSessions.filter(
      (trainingSession) => trainingSession.name.substring(0, 3) === day
    );
  }

  const registerHandler = (className) => {
    const values = {
      date: todaysDate,
      name: className,
      _id: null,
    };
    dispatch(updateAttendance(values));
  };

  const removeAttendeeHandler = async (id, recordId, className) => {
    await dispatch(attendeeRemove(id, recordId));
    const values = {
      date: todaysDate,
      name: className,
      id: null,
    };
    await dispatch(updateAttendance(values));
  };

  const addAttendeeHandler = async (id, recordId, className) => {
    await dispatch(attendeeAdd(id, recordId));
    const values = {
      date: todaysDate,
      name: className,
      id: null,
    };
    await dispatch(updateAttendance(values));
  };

  return (
    <div>
      <Container fluid="lg">
        <div className="d-flex justify-content-between align-items-center">
          <Link className="btn btn-dark" to="/admin">
            <i className="fas fa-arrow-left"></i> Return
          </Link>
          <div className="bg-dark py-2 px-4 rounded text-white">
            Day: {dayToday()}
          </div>
        </div>
        <h3 className="text-center border-bottom border-warning pb-1">
          Attendance
        </h3>
        <Row>
          {todaysClasses.map((indClass) => (
            <Col key={indClass._id}>
              <Card className="h-100">
                <Card.Header>{indClass.name}</Card.Header>
                <Card.Body>
                  <Card.Title>{indClass.times}</Card.Title>
                  <Card.Text>{indClass.location}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => {
                      const className = `${indClass.name}: ${indClass.times}`;
                      setParticipants(indClass.participants);
                      // set class name
                      registerHandler(className);
                    }}
                  >
                    View Register
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm text-center mt-3"
        >
          <thead>
            <tr className="text-center">
              <th>Name</th>
              <th>Present</th>
              <th>Not Present</th>
            </tr>
          </thead>
          <tbody>
            {participants &&
              participants.map((participant) => {
                // check if participant._id is included in the record.participants list

                // if yes: They are here and show as attending
                // if no: They are not here and show as not attending
                return (
                  <tr key={participant._id}>
                    <td>
                      {participant.firstName} {participant.lastName}
                    </td>
                    {/* map through currentAttendees and if id's match, show attending, else show not attending */}
                    {console.log(record.participants)}
                    {record.participants &&
                    record.participants.includes(participant._id.toString()) ? (
                      <>
                        <td>
                          <i className="fa-solid fa-circle-check text-success fa-3x"></i>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            className="btn-sm"
                            onClick={() =>
                              removeAttendeeHandler(
                                participant._id,
                                record._id,
                                record.name
                              )
                            }
                          >
                            Mark as Not Present
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          <Button
                            variant="outline-success"
                            className="btn-sm"
                            onClick={() =>
                              addAttendeeHandler(
                                participant._id,
                                record._id,
                                record.name
                              )
                            }
                          >
                            Mark as Present
                          </Button>
                        </td>
                        <td>
                          <i className="fa-solid fa-circle-xmark text-danger fa-3x"></i>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default AttendanceScreen;
