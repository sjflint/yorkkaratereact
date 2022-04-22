import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listTrainingSessions } from "../actions/trainingSessionActions";

const AttendanceScreen = ({ match, history }) => {
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

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    } else if (!memberInfo.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listTrainingSessions());
    }
  }, [dispatch, history, memberInfo]);

  let todaysClasses;
  const day = dayToday().substring(0, 3);
  if (trainingSessions) {
    todaysClasses = trainingSessions.filter(
      (trainingSession) => trainingSession.name.substring(0, 3) === day
    );
  }

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
                      history.push(
                        `/instructor/attendance/${indClass._id}/search/`
                      );
                    }}
                  >
                    View Register
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AttendanceScreen;
