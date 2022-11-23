import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  ListGroup,
  Modal,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import MemberDetails from "../components/ProfileComponents/MemberDetails";
import MemberOrders from "../components/ProfileComponents/MemberOrders";
import MemberClasses from "../components/ProfileComponents/MemberClasses";
import MemberPayment from "../components/ProfileComponents/MemberPayments";
import MemberVideos from "../components/ProfileComponents/MemberVideos";
import MemberEvents from "../components/ProfileComponents/MemberEvents";
import ImgDDSuccess from "../img/ddsuccess.png";
import UploadImage from "../components/uploadImage";
import jksLicense from "../img/jkslicense.png";
import insideJksLicense from "../img/insidelicense.png";
import { updateProfile } from "../actions/memberActions";
import { UPLOAD_IMG_CLEAR } from "../constants/uploadFileConstants";

const ProfileScreen = ({ history, match }) => {
  const search = useLocation().search;
  // Check for dd success
  const [ddModal, setDDModal] = useState(false);
  const [profileImgModal, setProfileImgModal] = useState(false);
  const [jksModal, setJksModal] = useState(false);
  const [value, setValue] = useState("");
  const ddSuccess = new URLSearchParams(search).get("dd");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading, member } = memberDetails;

  const singleImageData = (img) => {
    console.log(`Uploading Img ${img}`);
  };

  const myClassList = useSelector((state) => state.myClassList);
  const {
    // loading: classListLoading,
    // error: classListError,
    sessions,
  } = myClassList;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login?redirect=profile");
    }

    if (member.ddsuccess === false) {
      history.push("/accountinactive");
    }

    if (window.location.pathname.includes("ddsuccess")) {
      setDDModal(true);
      history.push("/profile");
    }
    if (!member.licenseNumber && !loading) {
      setJksModal(true);
    } else {
      setJksModal(false);
    }
  }, [
    dispatch,
    history,
    memberInfo,
    member,
    ddSuccess,
    loading,
    member.profileImg,
  ]);

  // set page history and active menu selection
  const keyValue = new URLSearchParams(search).get("key");
  let key;

  if (keyValue === null) {
    key = "first";
  } else {
    key = keyValue;
  }

  const [page, setPage] = useState("first");

  const changeUrl = () => {
    window.history.replaceState("", "", `?key=${page}`);
  };

  const updateLicenseNumber = () => {
    const values = {
      memberId: member._id,
      licenseNumber: value,
    };
    dispatch(updateProfile(values));
  };

  return (
    <div className="mt-3">
      <Container fluid="lg" id="profile-container">
        {memberInfo && (
          <>
            <Tab.Container id="left-tabs" defaultActiveKey={key}>
              <Row>
                <Col sm={3} xs={4} className="py-1">
                  <Nav variant="tabs" className="flex-column">
                    {member && (
                      <div className="d-flex flex-column">
                        <img
                          src={member.profileImg}
                          alt=""
                          className="rounded-0 profile-img"
                        />
                        <Button
                          className="mb-2 btn-default rounded-0 btn-sm p-1"
                          onClick={() => {
                            setProfileImgModal(true);
                            dispatch({ type: UPLOAD_IMG_CLEAR });
                          }}
                        >
                          Change Profile Picture
                        </Button>
                      </div>
                    )}

                    <Nav.Item
                      onMouseOver={() => setPage("first")}
                      onClick={changeUrl}
                    >
                      <Nav.Link eventKey="first">
                        <Row>
                          <Col sm={4}>
                            <div className="text-center">
                              <i className="fas fa-id-card fa-2x"></i>
                            </div>
                          </Col>
                          <Col sm={8} className="align-self-center">
                            <h6 className="text-center mb-0">Your Details</h6>
                          </Col>
                        </Row>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onMouseOver={() => setPage("second")}
                      onClick={changeUrl}
                    >
                      <Nav.Link eventKey="second">
                        <Row>
                          <Col sm={4}>
                            <div className="text-center">
                              <i className="fas fa-store fa-2x"></i>
                            </div>
                          </Col>
                          <Col sm={8} className="align-self-center">
                            <h6 className="text-center mb-0">Shop Orders</h6>
                          </Col>
                        </Row>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onMouseOver={() => setPage("third")}
                      onClick={changeUrl}
                    >
                      <Nav.Link eventKey="third">
                        <Row>
                          <Col sm={4}>
                            <div className="text-center">
                              <i className="fas fa-calendar-alt fa-2x"></i>
                            </div>
                          </Col>
                          <Col sm={8} className="align-self-center text-center">
                            <h6 className="text-center mb-0">
                              Classes
                              {sessions && !sessions[0] && (
                                <i className="fa-solid fa-triangle-exclamation text-danger fa-2x"></i>
                              )}
                            </h6>
                          </Col>
                        </Row>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onMouseOver={() => setPage("fourth")}
                      onClick={changeUrl}
                    >
                      <Nav.Link eventKey="fourth">
                        <Row>
                          <Col sm={4}>
                            <div className="text-center">
                              <i className="fas fa-video fa-2x"></i>
                            </div>
                          </Col>
                          <Col sm={8} className="align-self-center">
                            <h6 className="text-center mb-0">Videos</h6>
                          </Col>
                        </Row>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onMouseOver={() => setPage("fifth")}
                      onClick={changeUrl}
                    >
                      <Nav.Link eventKey="fifth">
                        <Row>
                          <Col sm={4}>
                            <div className="text-center">
                              <i className="fas fa-award fa-2x"></i>
                            </div>
                          </Col>
                          <Col sm={8} className="align-self-center">
                            <h6 className="text-center mb-0">Events</h6>
                          </Col>
                        </Row>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item
                      onMouseOver={() => setPage("sixth")}
                      onClick={changeUrl}
                    >
                      <Nav.Link eventKey="sixth">
                        <Row>
                          <Col sm={4}>
                            <div className="text-center">
                              <i className="far fa-credit-card fa-2x"></i>
                            </div>
                          </Col>
                          <Col sm={8} className="align-self-center">
                            <h6 className="text-center mb-0">
                              Payment details
                            </h6>
                          </Col>
                        </Row>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9} xs={8}>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <MemberDetails />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <MemberOrders />
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <MemberClasses />
                    </Tab.Pane>
                    <Tab.Pane eventKey="fourth">
                      <MemberVideos />
                    </Tab.Pane>
                    <Tab.Pane eventKey="fifth">
                      <MemberEvents />
                    </Tab.Pane>
                    <Tab.Pane eventKey="sixth">
                      <MemberPayment />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </>
        )}
      </Container>

      <Modal
        show={jksModal}
        onHide={() => {
          setJksModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">
            Add JKS Number to your profile
          </Modal.Title>
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

      {/* DD Modal */}
      <Modal
        show={ddModal}
        onHide={(e) => {
          setDDModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">
            Welcome to York Karate
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={ImgDDSuccess} alt="dd success" />
          <h5 className="text-center mt-2">Congratulations!</h5>
          <p className="text-center">
            Your direct debit and member application has been successful!
          </p>
          <p>
            Please take a moment to explore your virtual dojo. There are some
            things I would recommend you take a look at first:
          </p>
          <ul>
            <li>Customise your profile by uploading a profile picture</li>
            <li>Book yourself in for a training session or two</li>
            <li>
              Check out the training videos to help you achieve your first belt
            </li>
            <li>
              Take a look at our club shop if you need a dogi (karate suit)
            </li>
          </ul>
          <p>
            You can amend all of your class bookings/membership payments from
            here.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            variant="secondary"
            onClick={(e) => {
              setDDModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Image Modal */}
      <Modal
        show={profileImgModal}
        onHide={(e) => {
          setProfileImgModal(false);
          window.location.reload();
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Change Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {member._id && (
            <>
              <UploadImage
                img={member.profileImg}
                id={member._id}
                singleImageData={singleImageData}
                type={"Profile"}
              />
            </>
          )}
          <small className="text-center">
            Recommended aspect ratio: 1:1. Image will be cropped to fit <br />
            Please consider that this image might be displayed across the public
            website, as well as being displayed to grading examinars.
            <br /> The image should depict the member and be of a suitable
            nature.
          </small>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            variant="secondary"
            onClick={(e) => {
              setProfileImgModal(false);
              window.location.reload();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileScreen;
