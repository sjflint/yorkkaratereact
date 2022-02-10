import { Link } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import FormatDate from "./FormatDate";

const Event = ({ event }) => {
  return (
    <Row className="p-2 rounded h-100 align-items-center">
      <Col md={5} className="bg-primary p-2">
        <Link to={`/event/${event._id}`}>
          <img src={event.image} className="mb-2" alt="event" />
        </Link>
      </Col>
      <Col md={7}>
        <Link
          to={`/event/${event._id}`}
          className="d-flex flex-column text-decoration-none"
        >
          <Card>
            <Card.Body>
              <Card.Title>
                <strong>{event.title}</strong>
              </Card.Title>

              <Card.Text as="div">
                <div className="my-3">
                  Date of Event: <FormatDate date={event.dateOfEvent} />
                </div>
                <div>Event added by: {event.author}</div>
                <div>Location: {event.location}</div>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card.Footer>
            <small>
              Date added: <FormatDate date={event.dateCreated} />
            </small>
          </Card.Footer>
          <Button variant="default" className="btn-block mt-2">
            View more details
          </Button>
        </Link>
      </Col>
    </Row>
  );
};

export default Event;
