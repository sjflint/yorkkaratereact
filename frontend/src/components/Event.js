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
            <div className="bg-dark text-white p-2 m-0">
              <p className="my-1">{event.title}</p>
            </div>
            <Card.Body>
              <Card.Text as="div">
                <div className="my-3">
                  Date of Event: <FormatDate date={event.dateOfEvent} />
                </div>
                <div>Event added by: {event.author}</div>
                <div>Location: {event.location}</div>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card.Footer className="text-center">
            <small>
              Date added: <FormatDate date={event.dateCreated} />
            </small>
            <Button variant="outline-secondary" className="w-100 btn-sm">
              View more details
            </Button>
          </Card.Footer>
        </Link>
      </Col>
    </Row>
  );
};

export default Event;
