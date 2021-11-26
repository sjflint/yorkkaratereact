import { useEffect, useState } from "react";
import { Button, Container, Image, ListGroup, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { listEvent } from "../actions/eventActions";
import { getMemberDetails } from "../actions/memberActions";
import FormatDate from "../components/FormatDate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";
import logo from "../img/logo2021.png";

const GradingRegistrationScreen = ({ history, match }) => {
  const [applicationError, setApplicationError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const displayEvent = useSelector((state) => state.displayEvent);
  const { loading: loadingEvent, error: eventError, event } = displayEvent;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading: loadingMember, error: errorMember, member } = memberDetails;

  useEffect(() => {
    if (!memberInfo) {
      history.push(`/login?redirect=grading/${match.params.id}`);
    } else if (!member) {
      dispatch(getMemberDetails(memberInfo._id));
    }
    dispatch(listEvent(match.params.id));
  }, [dispatch, match, history, member, memberInfo]);

  let numberMarker;
  switch (member.kyuGrade && member.kyuGrade !== 0) {
    case 1:
      numberMarker = "st";
      break;
    case 2:
      numberMarker = "nd";
      break;
    case 3:
      numberMarker = "rd";
      break;
    default:
      numberMarker = "th";
  }
  switch (member.danGrade && member.danGrade !== 0) {
    case 1:
      numberMarker = "st";
      break;
    case 2:
      numberMarker = "nd";
      break;
    case 3:
      numberMarker = "rd";
      break;
    default:
      numberMarker = "th";
  }

  let grade;
  if (member && member.kyuGrade === 0) {
    grade = `${member.danGrade}${numberMarker} dan`;
  } else {
    grade = `${member.kyuGrade}${numberMarker} kyu`;
  }

  const submitApplicationHandler = async (application) => {
    console.log(application);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };
      let res = await axios.post(
        `http://localhost:5000/api/grading/${application.eventId}`,
        application,
        config
      );

      let data = res.data;
      if (data) {
        window.location.reload();
      }
    } catch (err) {
      setApplicationError(true);
    }
  };

  let applicationSuccess = false;
  if (event.title && event.participants.some((e) => e._id === member._id)) {
    applicationSuccess = true;
  }

  return (
    <Container>
      {loadingEvent ? (
        <Loader variant="warning" />
      ) : eventError ? (
        <Message>{eventError}</Message>
      ) : (
        <>
          <Image src={event.image} alt={event.title} />
          <ListGroup variant="flush">
            <h3 className="p-2">{event.title}</h3>
            <ListGroup.Item>
              Date of Event: <FormatDate date={event.dateOfEvent} />
            </ListGroup.Item>
            <ListGroup.Item>Location: {event.location}</ListGroup.Item>
            <ListGroup.Item>Event added by: {event.author}</ListGroup.Item>
          </ListGroup>
        </>
      )}
      {loadingMember ? (
        <Loader variant="warning" />
      ) : errorMember ? (
        <Message>{errorMember}</Message>
      ) : (
        <>
          <ListGroup variant="flush" className="mt-3">
            <h3 className="p2">Your Details</h3>
            <ListGroup.Item>
              Name: {member.nameFirst} {member.nameSecond}
            </ListGroup.Item>
            {member.danGrade > 0 ||
              (member.kyuGrade === 1 ? (
                <ListGroup.Item>
                  Grade: {grade}
                  <p className="text-danger">
                    This grading course is only for kyu grades. Unfortunatley,
                    you are not eligible.
                  </p>
                </ListGroup.Item>
              ) : (
                <ListGroup.Item>Grade: {grade}</ListGroup.Item>
              ))}
            <ListGroup.Item>
              Attendance Record: 16 sessions attended (24 required)
            </ListGroup.Item>
            {applicationError === true ? (
              <Message variant="danger">
                Application Error. Please try again later or contact us on
                admin@yorkkarate.net for assistance.
              </Message>
            ) : (
              <>
                {applicationSuccess === true ? (
                  <ListGroup.Item variant="success" className="text-center">
                    You have applied for this grading course!
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item>
                    <Button
                      className="btn-block btn-warning text-white"
                      onClick={() => setShowModal(true)}
                    >
                      You are eligible to Grade. Register Now
                    </Button>
                  </ListGroup.Item>
                )}
              </>
            )}
          </ListGroup>
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Register for the grading course</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-secondary text-white">
          <img src={logo} alt="logo" />
          <h5>Apply for this grading course?</h5>
          <p>
            We will register you for the course and the payment will be
            collected from your membership direct debit in the next 5 working
            days. <br />
            Do you wish to continue?
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-primary">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <button
            className="btn btn-warning"
            onClick={() => {
              const application = {
                eventId: event._id,
                memberId: member._id,
              };
              submitApplicationHandler(application);
              setShowModal(false);
            }}
          >
            Apply Now
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GradingRegistrationScreen;
