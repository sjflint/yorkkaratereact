import { useEffect, useState } from "react";
import { Button, Card, CardGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToWaitingList } from "../actions/trainingSessionActions";
import { WAITING_LIST_RESET } from "../constants/trainingSessionConstants";
import WaitingListForm from "./FormComponents/WaitingListForm";
import Loader from "./Loader";
import Message from "./Message";

const TrainingSession = ({ trainingSessions, trainingDay }) => {
  const [waitingListModal, setWaitingListModal] = useState(false);
  const [idNumber, setIdNumber] = useState("");

  const dispatch = useDispatch();

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading, error, member } = memberDetails;

  const waitingList = useSelector((state) => state.waitingList);
  const {
    loading: waitingLoading,
    error: errorWaiting,
    success,
    details,
  } = waitingList;

  const day = trainingSessions.filter(
    (trainingSessions) =>
      trainingSessions.name.split(" ")[0] ===
      trainingDay.charAt(0).toUpperCase() + trainingDay.slice(1)
  );

  const waitingListHandler = async (classId) => {
    if (member.firstName) {
      const details = {
        classId: classId,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
      };
      dispatch(addToWaitingList(details));
    } else {
      setIdNumber(classId);
      setWaitingListModal(true);
    }
  };

  useEffect(() => {
    if (success) {
      setWaitingListModal(false);
      setTimeout(myMessage, 7000);
    }
  });

  const myMessage = () => {
    dispatch({ type: WAITING_LIST_RESET });
  };

  return (
    <>
      <h4 className="bg-warning text-center py-2 text-white mb-0">
        {trainingDay}
      </h4>
      <CardGroup className="text-center">
        <Card>
          <Card.Body className="p-1">
            {day.map((trainingSession) => (
              <div
                className="mb-1 bg-black p-2 text-white"
                key={trainingSession._id}
              >
                <Card.Title className="mb-1 text-warning">
                  {trainingSession.name} Class
                </Card.Title>
                <Card.Subtitle className="text-muted">
                  {trainingSession.times}
                </Card.Subtitle>
                <Card.Text>{trainingSession.location}</Card.Text>
                <Card.Footer className="border-bottom border-warning mb-2">
                  <div>
                    {trainingSession.capacity - trainingSession.numberBooked >
                    0 ? (
                      <div>
                        Number of places available:{" "}
                        {trainingSession.capacity -
                          trainingSession.numberBooked}
                      </div>
                    ) : (
                      <div>
                        Fully Booked
                        {waitingLoading ? (
                          <Loader variant="warning" />
                        ) : errorWaiting ? (
                          <Message>{errorWaiting}</Message>
                        ) : success && details._id === trainingSession._id ? (
                          <div>
                            <i className="fa-solid fa-thumbs-up fa-2x text-success"></i>
                            <br />
                            We've got your details and will be in touch.
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              waitingListHandler(trainingSession._id)
                            }
                            className="pointer"
                          >
                            <i className="fa-solid fa-bell fa-2x text-warning"></i>
                            <br />
                            <small className="text-warning">
                              Notify me when a place becomes available
                            </small>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card.Footer>
              </div>
            ))}
          </Card.Body>
        </Card>
      </CardGroup>

      {/* waiting list registration modal */}
      <Modal show={waitingListModal} onHide={() => setWaitingListModal(false)}>
        <Modal.Header closeButton className="bg-black">
          <Modal.Title className="text-warning">
            Join the waiting list
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WaitingListForm classId={idNumber} />
          {/* Take a look at the trainingsession controller. How to check if the mongoose push was sucessful?? */}
        </Modal.Body>
        <Modal.Footer className="bg-black">
          <Button onClick={() => setWaitingListModal(false)} variant="default">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default TrainingSession;
