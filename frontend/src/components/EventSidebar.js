import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import FormatDate from "./FormatDate";

const EventSidebar = ({ event }) => {
  return (
    <Card className="p-2 rounded h-100 mb-2">
      <Link to={`/event/${event._id}`}>
        <Card.Img src={event.image} alt="Event" className="mb-2" />
      </Link>
      <Link to={`/event/${event._id}`}>
        <div>
          <h5>
            <strong>{event.title}</strong>
          </h5>

          <div className="my-3">{event.leader}</div>
        </div>
        <Card.Footer>
          <small>
            Date of Event: <FormatDate date={event.dateOfEvent} />
          </small>
        </Card.Footer>
      </Link>
    </Card>
  );
};

export default EventSidebar;
