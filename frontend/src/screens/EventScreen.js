import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Container, Button } from "react-bootstrap";
import Event from "../components/Event";
import FormatDate from "../components/FormatDate";
import { listEvent } from "../actions/eventActions";
import { listEvents } from "../actions/eventActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

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
    <Container>
      <Row>
        <Col md={8}>
          {loadingEvent ? (
            <Loader variant="warning" />
          ) : errorEvent ? (
            <Message variant="warning" heading="Event failed to load">
              {errorEvent}
            </Message>
          ) : (
            <div>
              <Image src={event.image} alt={event.title} />
              <ListGroup variant="flush">
                <h3 className="p-2">{event.title}</h3>
                <ListGroup.Item className="bg-primary">
                  Date of Event: <FormatDate date={event.dateOfEvent} />
                </ListGroup.Item>
                <ListGroup.Item>Location: {event.location}</ListGroup.Item>
                <ListGroup.Item>Event added by: {event.author}</ListGroup.Item>
                {event.register && (
                  <ListGroup.Item>
                    <Link to={event.register}>
                      <Button variant="warning" className="btn-block">
                        Register
                      </Button>
                    </Link>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="bg-dark">
                  <h5>Event Description</h5>
                  <p>{event.description}</p>
                </ListGroup.Item>
                <Link className="btn btn-primary my-3" to="/events">
                  Return to event listings
                </Link>
              </ListGroup>
            </div>
          )}
        </Col>
        <Col md={4} className="bg-primary mb-2">
          <h5 className="text-center text-white pt-2">More events</h5>
          {loadingEvents ? (
            <Loader variant="warning" />
          ) : errorEvents ? (
            <Message variant="warning" heading="Error loading articles">
              {errorEvents}
            </Message>
          ) : (
            <div>
              {moreEvents.slice(0, 3).map((event) => (
                <Event event={event} key={event._id} />
              ))}
            </div>
          )}
          <Link className="btn btn-block btn-primary my-3" to="/events">
            Return to event listings
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default EventScreen;
