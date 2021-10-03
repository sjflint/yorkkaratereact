import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Button, Col, Container, Modal, Nav, Row, Tab } from "react-bootstrap";
import MemberDetails from "../components/ProfileComponents/MemberDetails";
import MemberOrders from "../components/ProfileComponents/MemberOrders";
import MemberClasses from "../components/ProfileComponents/MemberClasses";
import MemberPayment from "../components/ProfileComponents/MemberPayments";
import MemberVideos from "../components/ProfileComponents/MemberVideos";

import MemberEvents from "../components/ProfileComponents/MemberEvents";
import ImgDDSuccess from "../img/ddsuccess.png";
import UploadImage from "../components/uploadImage";

const ProfileScreen = ({ history, match }) => {
  const search = useLocation().search;
  // Check for dd success
  const [ddModal, setDDModal] = useState(false);
  const [profileImgModal, setProfileImgModal] = useState(false);
  const ddSuccess = new URLSearchParams(search).get("dd");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    }
    if (member.ddMandate === "cancelled") {
      history.push("/membershipcancelled");
    }
    if (window.location.pathname.includes("ddsuccess")) {
      setDDModal(true);
      history.push("/profile");
    }
  }, [dispatch, history, memberInfo, member, ddSuccess]);

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

  return (
    <>
      <Container fluid="lg" id="profile-container">
        <Tab.Container id="left-tabs" defaultActiveKey={key}>
          <Row>
            <Col sm={3} xs={4} className="py-1">
              <Nav variant="tabs" className="flex-column">
                {member && (
                  <>
                    <img src={member.profileImg} alt="" className="rounded-0" />
                    <Button
                      className="mb-2 btn-warning rounded-0"
                      onClick={() => setProfileImgModal(true)}
                    >
                      Change Profile Picture
                    </Button>
                  </>
                )}

                <Nav.Item
                  onMouseOver={() => setPage("first")}
                  onClick={changeUrl}
                >
                  <Nav.Link eventKey="first">
                    <Row>
                      <Col xs={3} className="align-self-center">
                        <i className="fas fa-id-card mr-3 text-center"></i>
                      </Col>
                      <Col>Your Details</Col>
                    </Row>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onMouseOver={() => setPage("second")}
                  onClick={changeUrl}
                >
                  <Nav.Link eventKey="second">
                    <Row>
                      <Col xs={3} className="align-self-center">
                        <i className="fas fa-store mr-3"></i>
                      </Col>
                      <Col>Shop Orders</Col>
                    </Row>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onMouseOver={() => setPage("third")}
                  onClick={changeUrl}
                >
                  <Nav.Link eventKey="third">
                    <Row>
                      <Col xs={3} className="align-self-center">
                        <i className="fas fa-calendar-alt mr-3"></i>
                      </Col>
                      <Col>Class Bookings</Col>
                    </Row>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onMouseOver={() => setPage("fourth")}
                  onClick={changeUrl}
                >
                  <Nav.Link eventKey="fourth">
                    <Row>
                      <Col xs={3} className="align-self-center">
                        <i className="fas fa-video mr-3"></i>
                      </Col>
                      <Col>Training Videos</Col>
                    </Row>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onMouseOver={() => setPage("fifth")}
                  onClick={changeUrl}
                >
                  <Nav.Link eventKey="fifth">
                    <Row>
                      <Col xs={3} className="align-self-center">
                        <i className="fas fa-award mr-3 ml-1"></i>
                      </Col>
                      <Col>Events</Col>
                    </Row>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item
                  onMouseOver={() => setPage("sixth")}
                  onClick={changeUrl}
                >
                  <Nav.Link eventKey="sixth">
                    <Row>
                      <Col xs={3} className="align-self-center">
                        <i className="far fa-credit-card mr-3"></i>
                      </Col>
                      <Col>Payment details</Col>
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
      </Container>

      {/* DD Modal */}
      <Modal
        show={ddModal}
        onHide={(e) => {
          setDDModal(false);
        }}
      >
        <Modal.Header closeButton className="text-white bg-secondary">
          <Modal.Title>Welcome to York Karate</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
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
        <Modal.Footer className="bg-light">
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
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadImage
            img={member.profileImg}
            type={"Profile"}
            id={member._id}
          />
          <small className="text-center">
            Recommended aspect ratio: 1:1. Image will be cropped to fit <br />
            Please consider that this image might be displayed across the public
            website, as well as being displayed to grading examinars.
            <br /> The image should depict the member and be of a suitable
            nature.
          </small>
        </Modal.Body>
        <Modal.Footer>
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
    </>
  );
};

export default ProfileScreen;
