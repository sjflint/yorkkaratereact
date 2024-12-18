import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Container, Button } from "react-bootstrap";
import FormatDate from "../components/FormatDate";
import { listEvent } from "../actions/eventActions";
import { listEvents } from "../actions/eventActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import EventSidebar from "../components/EventSidebar";

const EventScreen = ({ match }) => {
  const dispatch = useDispatch();

  const displayEvent = useSelector((state) => state.displayEvent);
  const { loadingEvent, errorEvent, event } = displayEvent;

  const eventList = useSelector((state) => state.eventList);
  const { loadingEvents, errorEvents, events } = eventList;

  useEffect(() => {
    dispatch(listEvent(match.params.id));
    dispatch(listEvents());
  }, [dispatch, match]);

  const eventId = event._id;

  const moreEvents = events.filter((event) => event._id !== eventId);

  return (
    <Container fluid="lg" className="mt-3">
      <Row>
        <Col md={8}>
          {loadingEvent ? (
            <Loader variant="warning" />
          ) : errorEvent ? (
            <Message variant="warning" heading="Event failed to load">
              {errorEvent}
            </Message>
          ) : (
            <>
              <div className="bg-primary p-2">
                <Image src={event.image} alt={event.title} />
              </div>
              <ListGroup variant="flush">
                <h3 className="p-2">{event.title}</h3>
                <ListGroup.Item>
                  Date of Event: <FormatDate date={event.dateOfEvent} />
                </ListGroup.Item>
                <ListGroup.Item>Location: {event.location}</ListGroup.Item>
                <ListGroup.Item>Event added by: {event.author}</ListGroup.Item>

                <ListGroup.Item>
                  <h5>Event Description</h5>
                  <p style={{ whiteSpace: "pre-line" }}>{event.description}</p>
                </ListGroup.Item>
                {event.register === "/grading" ||
                event.register === "/squadselection" ? (
                  <ListGroup.Item className="text-center">
                    <a href={`${event.register}/${event._id}`} rel="noreferrer">
                      <Button variant="outline-secondary" className="w-75 py-0">
                        Register
                      </Button>
                    </a>
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item className="text-center">
                    <a href={event.register} target="_blank" rel="noreferrer">
                      <Button variant="outline-secondary" className="w-75 py-0">
                        Register
                      </Button>
                    </a>
                  </ListGroup.Item>
                )}
                <div className="mt-2 mb-5 border-bottom border-warning">
                  <Link
                    className="btn btn-secondary btn-sm mb-5 w-100 text-left"
                    to="/events"
                  >
                    <i className="fa-solid fa-arrow-left"></i> Return to event
                    listings
                  </Link>
                </div>
              </ListGroup>
            </>
          )}
        </Col>
        <Col md={4} className="mb-2">
          <h5 className="text-center p-2">More events</h5>
          {loadingEvents ? (
            <Loader variant="warning" />
          ) : errorEvents ? (
            <Message variant="warning" heading="Error loading articles">
              {errorEvents}
            </Message>
          ) : (
            <div>
              {moreEvents.slice(0, 3).map((event) => (
                <EventSidebar event={event} key={event._id} />
              ))}
            </div>
          )}

          <Link className="btn w-100 btn-outline-secondary btn-sm" to="/events">
            Return to event listings
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default EventScreen;
