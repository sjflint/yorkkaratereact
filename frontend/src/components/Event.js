import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import FormatDate from "./FormatDate";

const Event = ({ event }) => {
  return (
    <Card className=" mb-2 rounded h-100">
      <Link to={`/event/${event._id}`}>
        <Card.Img src={event.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/event/${event._id}`}>
          <Card.Title as="div">
            <strong>{event.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">
            Date of Event: <FormatDate date={event.dateOfEvent} />
          </div>
          <div className="text-white">Event added by: {event.author}</div>
          <div className="text-white">Location: {event.location}</div>
          <small className="text-white">
            Date added: <FormatDate date={event.dateCreated} />
          </small>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Link to={`/event/${event._id}`}>
          <Button variant="warning" className="btn-block">
            Further Info
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default Event;
