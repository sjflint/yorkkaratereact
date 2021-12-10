import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Event from "../components/Event";
import { listEvents } from "../actions/eventActions";

const EventsScreen = () => {
  const dispatch = useDispatch();

  const eventList = useSelector((state) => state.eventList);
  const { loadingEvents, error, events } = eventList;

  useEffect(() => {
    dispatch(listEvents());
  }, [dispatch]);

  const today = Date.parse(new Date());

  const filteredEvents = events.filter((event) => {
    const eventDate = Date.parse(event.dateOfEvent);
    return eventDate > today;
  });

  return (
    <>
      <Container fluid="lg">
        <h3 className="text-center border-bottom border-warning pb-1">
          Upcoming Events
        </h3>
        {loadingEvents ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading events">
            {error}
          </Message>
        ) : (
          filteredEvents.map((event) => (
            <div className="mb-2" key={event._id}>
              {console.log(Date.parse(event.dateOfEvent))}
              <Event event={event} />
            </div>
          ))
        )}
      </Container>
    </>
  );
};

export default EventsScreen;
