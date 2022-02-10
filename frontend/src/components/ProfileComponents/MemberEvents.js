import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import { listEvents } from "../../actions/eventActions";
import Loader from "../Loader";
import Message from "../Message";
import Event from "../../components/Event";
import dojoImg from "../../img/dojo.jpeg";

const MemberEvents = () => {
  const dispatch = useDispatch();

  const eventList = useSelector((state) => state.eventList);
  const { loadingEvents, error, events } = eventList;

  useEffect(() => {
    dispatch(listEvents());
  }, [dispatch]);

  return (
    <>
      {loadingEvents ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="warning" heading="Error loading events">
          {error}
        </Message>
      ) : (
        <>
          <img src={dojoImg} alt="dojo" />
          <h2 className="border-bottom border-warning mt-2 text-warning">
            Your Events
          </h2>

          {events.map((event) => (
            <Event event={event} key={event._id} />
          ))}
        </>
      )}
    </>
  );
};

export default MemberEvents;
