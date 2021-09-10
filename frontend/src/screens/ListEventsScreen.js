import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { listEvents } from "../actions/eventActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ListEventsScreen = ({ history, match }) => {
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;
  const activeMembers = [];

  const eventList = useSelector((state) => state.eventList);
  const { loading, error, events } = eventList;

  useEffect(() => {
    if (memberInfo && memberInfo.isAdmin) {
      dispatch(listEvents());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, memberInfo]);

  const deleteHandler = async () => {
    // delete event
  };

  const createEventHandler = () => {
    // create event
  };

  return (
    <Container fluid="lg">
      <Link className="btn btn-dark" to="/admin">
        <i className="fas fa-arrow-left"></i> Return
      </Link>

      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="align-items-center">
            <Col>
              <h3 className="text-center border-bottom border-warning pb-1">
                Events
              </h3>
            </Col>
            <Col className="text-right">
              <Button className="my-3" onClick={createEventHandler}>
                <i className="fas fa-plus"></i> Create Event
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date of Event</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>

                  <td>{event.dateOfEvent.substring(0, 10)}</td>
                  <td>
                    {
                      <>
                        <Button
                          variant="light"
                          className="btn-sm"
                          onClick={() => {
                            setShow(true);
                            setDeleteId(event._id);
                          }}
                        >
                          <i
                            className="fas fa-trash"
                            style={{ color: "red" }}
                          ></i>
                        </Button>

                        <LinkContainer to={`/admin/events/${event._id}/edit`}>
                          <Button variant="light" className="btn-sm">
                            <i
                              className="fas fa-edit"
                              style={{ color: "green" }}
                            ></i>
                          </Button>
                        </LinkContainer>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Event?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the event from the database and
          the details will be irretrievable. <br /> Are you sure?
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

export default ListEventsScreen;
