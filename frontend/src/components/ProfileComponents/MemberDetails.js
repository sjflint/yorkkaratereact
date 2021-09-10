import { useEffect, useState } from "react";
import { Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import {
  getMemberDetails,
  updatePassword,
  updateProfile,
} from "../../actions/memberActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader";
import Message from "../Message";
import dojoImg from "../../img/dojo.jpeg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormComponents/FormikControl";
import "yup-phone";

const MemberDetails = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading, error, member } = memberDetails;

  const updatePasswordStatus = useSelector((state) => state.updatePassword);
  const {
    loading: loadingPasswordUpdate,
    error: errorPasswordUpdate,
    success: successPasswordUpdate,
  } = updatePasswordStatus;

  useEffect(() => {
    dispatch(getMemberDetails("profile"));
  }, [dispatch]);

  // Update details form
  // Formik init, val and submit
  const initialValues = {
    addressLine1: member.AddressLine1,
    addressLine2: member.AddressLine2,
    addressLine3: member.AddressLine3,
    addressLine4: member.AddressLine4,
    postCode: member.postcode,
    email: member.email,
    confirmEmail: "",
    phone: `0${member.phone}`,
    emergencyContactName: member.emergencyContactName,
    emergencyContactEmail: member.emergencyContactEmail,
    emergencyContactPhone: `0${member.emergencyContactPhone}`,
  };

  const validationSchema = Yup.object({
    addressLine1: Yup.string().required("Required"),
    addressLine2: Yup.string(),
    addressLine3: Yup.string(),
    addressLine4: Yup.string(),
    postCode: Yup.string().required("Required"),
    email: Yup.string().required().email(),
    confirmEmail: Yup.string()
      .required()
      .oneOf([Yup.ref("email"), null], "email does not match"),
    phone: Yup.string().required("Required").phone("GB", true),
    emergencyContactName: Yup.string()
      .required("Required")
      .notOneOf(
        [Yup.ref("firstName"), null],
        "Name cannot be the same as the member"
      ),
    emergencyContactEmail: Yup.string()
      .required("Required")
      .notOneOf(
        [Yup.ref("email"), null],
        "Email cannot be the same as the member"
      ),
    emergencyContactPhone: Yup.string()
      .required("Required")
      .phone("GB", true)
      .notOneOf(
        [Yup.ref("phone"), null],
        "Phone number cannot be the same as the member"
      ),
  });

  const passwordInitialValues = {
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const passwordValidationSchema = Yup.object({
    password: Yup.string().required("Required"),

    newPassword: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters")
      .matches(
        /(?=.*[0-9])(?=.*[a-z])/,
        "password must contain a combination of numbers and letters"
      ),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });

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

  const saveHandler = async (values) => {
    const memberId = member._id;
    values.memberId = memberId;
    dispatch(updateProfile(values));
    setShowModal(false);
    await dispatch(getMemberDetails("profile"));
  };

  const updatePasswordHandler = async (passwordValues) => {
    const memberId = member._id;
    passwordValues.memberId = memberId;
    await dispatch(updatePassword(passwordValues));
    if (updatePasswordStatus.success === true) {
      console.log(updatePasswordStatus);
      setShowPasswordModal(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <img src={dojoImg} alt="dojo" />
          <h2 className="mt-2 border-bottom border-warning text-warning">
            Welcome {member.nameFirst}!
          </h2>
          <p>
            This is your virtual dojo. Here you will find all of your details,
            training videos, orders and courses that you can register for. You
            can book classes, amend bookings, change your payment details and
            much more.
          </p>
          <h2>Your details</h2>

          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col xs={4}>
                  <strong className="text-white">Name</strong>
                </Col>
                <Col>{`${member.nameFirst} ${member.nameSecond}`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={4}>
                  <strong className="text-white">Email</strong>
                </Col>
                <Col>{`${member.email}`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={4}>
                  <strong className="text-white">Phone</strong>
                </Col>
                <Col>{`0${member.phone}`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={4}>
                  <strong className="text-white">Username</strong>
                </Col>
                <Col> {`${member.userName}`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={4}>
                  <strong className="text-white">Grade</strong>
                </Col>
                <Col>{`${grade} (${member.gradeLevel})`}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col xs={4}>
                  <strong className="text-white">Membership Level</strong>
                </Col>
                <Col>£{(member.membershipLevel / 100).toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="mt-3">
              <Row>
                <Col>
                  <Button
                    variant="secondary"
                    className="h6 btn-block"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-tools"></i> Update contact details
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="secondary"
                    className="h6 btn-block"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <i className="fas fa-key"></i> Change Password
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </>
      )}

      {/* Update user modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="text-white bg-secondary">
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={saveHandler}
          >
            {({ values }) => (
              <Form>
                <Row className="py-4 border-bottom border-warning">
                  <Col>
                    <FormikControl
                      control="input"
                      type="text"
                      label="Address"
                      name="addressLine1"
                      placeholder="Address number/name"
                      margin="mb-0"
                    />

                    <FormikControl
                      control="input"
                      type="text"
                      name="addressLine2"
                      placeholder="Street"
                      margin="mb-0"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      name="addressLine3"
                      placeholder="Village/Town/District"
                      margin="mb-0"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      name="addressLine4"
                      placeholder="City"
                      margin="mb-0"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      name="postCode"
                      placeholder="Postcode"
                    />
                  </Col>

                  <Col>
                    <FormikControl
                      control="input"
                      label="Email"
                      type="text"
                      name="email"
                      placeholder="Please enter your Email"
                    />

                    <FormikControl
                      control="input"
                      label="Confirm Email"
                      type="text"
                      name="confirmEmail"
                      placeholder="Confirm Email"
                    />

                    <FormikControl
                      control="input"
                      label="Phone Number"
                      type="text"
                      name="phone"
                      placeholder="Please enter your phone number"
                    />
                  </Col>
                </Row>

                <div className="py-4 border-bottom border-warning">
                  <FormikControl
                    control="input"
                    label="Name of emergency contact"
                    type="text"
                    name="emergencyContactName"
                    placeholder="Please enter their name"
                  />

                  <FormikControl
                    control="input"
                    label="Email of emergency contact"
                    type="text"
                    name="emergencyContactEmail"
                    placeholder="Please enter their email"
                  />

                  <FormikControl
                    control="input"
                    label="Number of emergency contact"
                    type="text"
                    name="emergencyContactPhone"
                    placeholder="Please enter their number"
                  />
                </div>
                <Row className="mt-2">
                  <Col>
                    <Button type="submit" className="btn btn-warning btn-block">
                      Update
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="btn btn-block btn-primary m-0"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Update password modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      >
        <Modal.Header closeButton className="text-white bg-secondary">
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={updatePasswordHandler}
          >
            {({ passwordValues }) => (
              <Form>
                {loadingPasswordUpdate ? (
                  <Loader variant="warning" />
                ) : errorPasswordUpdate ? (
                  <Message variant="danger">{errorPasswordUpdate}</Message>
                ) : null}

                {successPasswordUpdate ? (
                  <Message variant="success">Password Updated</Message>
                ) : (
                  <>
                    <Row className="py-4 border-bottom border-warning">
                      <Col>
                        <FormikControl
                          control="input"
                          label="Please enter current Password"
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                        />
                      </Col>
                    </Row>
                    <Row className="py-4">
                      <Col>
                        <FormikControl
                          control="input"
                          label="Please set a new password"
                          name="newPassword"
                          type="password"
                          placeholder="Set Password"
                        />
                      </Col>
                      <Col>
                        <FormikControl
                          control="input"
                          label="Please confirm new password"
                          name="confirmNewPassword"
                          type="password"
                          placeholder="Confirm password"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button type="submit" variant="warning btn-block">
                          Update
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          variant="primary btn-block"
                          onClick={() => setShowPasswordModal(false)}
                        >
                          Close
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MemberDetails;
