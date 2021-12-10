import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import FormatDate from "./FormatDate";

const Event = ({ event }) => {
  return (
    <Row className="p-2 rounded h-100 bg-primary">
      <Col md={5}>
        <Link to={`/event/${event._id}`}>
          <img src={event.image} className="mb-2" alt="event" />
        </Link>
      </Col>
      <Col md={7}>
        <Link to={`/event/${event._id}`}>
          <Card>
            <Card.Body>
              <Card.Title>
                <strong>{event.title}</strong>
              </Card.Title>

              <Card.Text as="div">
                <div className="my-3">
                  Date of Event: <FormatDate date={event.dateOfEvent} />
                </div>
                <div className="text-white">Event added by: {event.author}</div>
                <div className="text-white">Location: {event.location}</div>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card.Footer>
            <small className="text-white">
              Date added: <FormatDate date={event.dateCreated} />
            </small>
          </Card.Footer>
        </Link>
      </Col>
    </Row>
  );
};

export default Event;
