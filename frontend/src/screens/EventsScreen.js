import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
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
    <>
      <Container>
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
          <Row>
            {events.map((event) => (
              <Col md={6} key={event._id} className="mb-4">
                <Event event={event} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default EventsScreen;
