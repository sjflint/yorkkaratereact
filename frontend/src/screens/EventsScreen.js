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

  return (
    <div className="mt-3">
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
          events.map((event) => (
            <div className="mb-2" key={event._id}>
              <Event event={event} />
            </div>
          ))
        )}
      </Container>
    </div>
  );
};

export default EventsScreen;
