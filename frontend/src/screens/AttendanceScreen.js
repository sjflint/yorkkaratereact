import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const AttendanceScreen = ({ match, history }) => {
  const [customDay, setCustomDay] = useState();
  const [customDate, setCustomDate] = useState(new Date());

  const dayToday = () => {
    let day;
    if (customDay && customDate < new Date()) {
      day = Number(customDay);
    } else {
      const d = new Date();
      day = d.getDay();
    }

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
      history.push("/login?redirect=instructor/attendance");
    } else if (!memberInfo.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listTrainingSessions());
    }
  }, [dispatch, history, memberInfo]);

  let todaysClasses;
  let day = dayToday().substring(0, 3);

  const options = [
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
    { label: "Sunday", value: 0 },
  ];

  return (
    <div className="mt-3">
      <Container fluid="lg">
        <div className="max-width-500 p-2 my-3 bg-grey mx-auto">
          <Form.Group>
            <Form.Label>
              Set a date to go back and edit previous classes
            </Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => {
                setCustomDate(new Date(e.target.value));
                setCustomDay(new Date(e.target.value).getDay());
              }}
              max={new Date().toISOString().slice(0, 10)}
            />
            {customDate > new Date() && (
              <Message variant="danger">
                Date cannot be set for the future
              </Message>
            )}
          </Form.Group>
        </div>

        {loading && <Loader variant="warning" />}
        {error && <Message variant="danger">{error}</Message>}
        <div className="d-flex justify-content-between align-items-center">
          <Link className="btn btn-outline-secondary py-0" to="/admin">
            <i className="fas fa-arrow-left"></i> Return
          </Link>
          <div className="btn btn-outline-secondary py-0">
            Day: {dayToday()}
          </div>
        </div>
        <h3 className="text-center border-bottom border-warning pb-1">
          Attendance{" "}
          {customDate > new Date()
            ? `${new Date().toLocaleDateString("en-GB")}`
            : `${customDate.toLocaleDateString("en-GB")}`}
        </h3>
        <Row>
          {trainingSessions &&
            trainingSessions.map(
              (indClass) =>
                indClass.name.substring(0, 3) === day && (
                  <Col
                    key={indClass._id}
                    lg={4}
                    md={6}
                    sm={12}
                    className="mb-3"
                  >
                    <Card className="h-100">
                      <Card.Header>{indClass.name}</Card.Header>
                      <Card.Body>
                        <Card.Title>{indClass.times}</Card.Title>
                        <Card.Text>{indClass.location}</Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <Button
                          variant="outline-secondary"
                          className="w-100"
                          onClick={() => {
                            history.push(
                              `/instructor/attendance/${
                                indClass._id
                              }/${customDate.toISOString()}/search/~`
                            );
                          }}
                        >
                          View Register
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                )
            )}
        </Row>
      </Container>
    </div>
  );
};

export default AttendanceScreen;
