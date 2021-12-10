import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Image,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { listEvent } from "../actions/eventActions";
import { getMemberDetails } from "../actions/memberActions";
import FormatDate from "../components/FormatDate";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";
import logo from "../img/logo2021.png";
import jksLicense from "../img/jkslicense.png";
import insideJksLicense from "../img/insidelicense.png";
import { updateProfile } from "../actions/memberActions";

const GradingRegistrationScreen = ({ history, match }) => {
  const [applicationError, setApplicationError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [jksModal, setJksModal] = useState(false);
  const [value, setValue] = useState("");

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

    if (member.licenseNumber) {
      setJksModal(false);
    } else {
      setJksModal(true);
    }
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

  const updateLicenseNumber = async () => {
    const values = {
      memberId: member._id,
      licenseNumber: value,
    };
    await dispatch(updateProfile(values));
    await dispatch(getMemberDetails(memberInfo._id));
  };

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
                ) : !member.licenseNumber ? (
                  <ListGroup.Item variant="danger" className="text-center">
                    <Button variant="danger" onClick={() => setJksModal(true)}>
                      You are unable to register as we are missing your license
                      number. Click here to add the license number.
                    </Button>
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
      <Modal
        show={jksModal}
        onHide={() => {
          setJksModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Add JKS Number to your profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-dark text-center">
          <p className="text-center">
            We are missing your JKS England License number.
          </p>
          <Row className="mb-4 pb-2 align-items-center border-bottom border-warning">
            <Col>
              <img src="/img/logojapan-1.png" alt="jks-logo" />
            </Col>
            <Col>
              <ListGroup>
                <ListGroup.Item variant="light">
                  Apply for a JKS England license via their website:
                </ListGroup.Item>
                <ListGroup.Item variant="secondary">
                  Visit:{" "}
                  <a
                    href="https://www.jksengland.com/members"
                    target="_blank"
                    className="light-link"
                    rel="noreferrer"
                  >
                    www.jksengland.com
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-4 align-items-center pb-2 border-bottom border-warning">
            <Col>
              <img src={jksLicense} alt="jks-license-book" />
            </Col>
            <Col>
              <ListGroup>
                <ListGroup.Item variant="light">
                  Wait for the postman...
                </ListGroup.Item>
                <ListGroup.Item variant="secondary">
                  Your new license book will be sent to you through the post.
                  Usually, this happens in 2 - 3 weeks.
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <Row className="mb-4 align-items-center pb-2 border-bottom border-warning">
            <Col xs={6}>
              <img src={insideJksLicense} alt="jks-license-book" />
            </Col>
            <Col xs={6}>
              <ListGroup>
                <ListGroup.Item variant="light">
                  Find your license number near the front of the license book
                  and enter it below.
                </ListGroup.Item>
                <ListGroup.Item variant="secondary">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="License number"
                    className="w-75 text-center"
                  />
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {value !== "" && value.length > 2 && value.length < 6 ? (
            <button
              className="btn btn-default"
              onClick={(e) => {
                updateLicenseNumber();
                setJksModal(false);
              }}
            >
              Save number
            </button>
          ) : (
            <button className="btn btn-primary" disabled>
              Save number
            </button>
          )}

          <Button
            variant="secondary"
            onClick={(e) => {
              setJksModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GradingRegistrationScreen;
