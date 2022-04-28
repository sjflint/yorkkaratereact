import { useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listEvents } from "../actions/eventActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ListGradingsScreen = ({ history }) => {
  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const eventList = useSelector((state) => state.eventList);
  const { loading, error, events } = eventList;

  // const displayEvent = useSelector((state) => state.displayEvent);
  // const { error: eventError, event } = displayEvent;

  let filteredEvents = [];
  if (events) {
    filteredEvents = events.filter((event) => event.register === "/grading");
  }

  useEffect(() => {
    if (!memberInfo) {
      history.push(`/login`);
    } else if (!member.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listEvents());
    }
  }, [dispatch, history, memberInfo, member]);

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
      </div>

      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Grading Courses
          </h3>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Title</th>
                <th>Date of Event</th>
                <th>Number of Participants</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td className="text-center align-middle max-width-200">
                    <img
                      src={event.image}
                      alt="grading course"
                      max-width="80"
                      fluid
                    />
                  </td>
                  <td className="text-center align-middle">{event.title}</td>
                  <td className="text-center align-middle">
                    {new Date(event.dateOfEvent).toLocaleDateString()}
                  </td>
                  <td className="text-center align-middle">
                    {event.participants.length}
                  </td>
                  <td className="text-center align-middle">
                    <a href={`/gradingdetails/${event._id}`}>
                      <Button variant="warning" className="btn-sm">
                        <i className="fa-solid fa-eye"></i>
                      </Button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <small>
            To edit/delete a grading course, please visit the{" "}
            <Link to="/admin/editevents" className="text-info">
              Events page
            </Link>{" "}
            if you have admin access.
          </small>
        </>
      )}
    </Container>
  );
};

export default ListGradingsScreen;
