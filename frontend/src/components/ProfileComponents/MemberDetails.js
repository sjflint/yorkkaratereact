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
import { gradingResultsList } from "../../actions/gradingActions";

const MemberDetails = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState("password");
  const [gradingModal, setGradingModal] = useState(false);

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading, error, member } = memberDetails;

  const updatePasswordStatus = useSelector((state) => state.updatePassword);
  const {
    loading: loadingPasswordUpdate,
    error: errorPasswordUpdate,
    success: successPasswordUpdate,
  } = updatePasswordStatus;

  const listGradingResults = useSelector((state) => state.listGradingResults);
  const {
    loading: loadingResults,
    error: errorResults,
    gradingResults,
  } = listGradingResults;

  const updateProfileDetails = useSelector(
    (state) => state.updateProfileDetails
  );
  const { success: updateProfileSuccess } = updateProfileDetails;

  useEffect(() => {
    dispatch(getMemberDetails("profile"));
    dispatch(gradingResultsList(member._id));
  }, [dispatch, updateProfileSuccess]);

  // Update details form
  // Formik init, val and submit
  const initialValues = {
    bio: member.bio,
    addressLine1: member.addressLine1,
    addressLine2: member.addressLine2,
    addressLine3: member.addressLine3,
    addressLine4: member.addressLine4,
    postCode: member.postCode,
    email: member.email,
    confirmEmail: "",
    secondaryEmail: member.secondaryEmail,
    phone: `0${member.phone}`,
    emergencyContactName: member.emergencyContactName,
    emergencyContactEmail: member.emergencyContactEmail,
    emergencyContactPhone: `0${member.emergencyContactPhone}`,
    weight: member.weight,
  };

  const validationSchema = Yup.object({
    bio: Yup.string().required("Required"),
    addressLine1: Yup.string().required("Required"),
    addressLine2: Yup.string(),
    addressLine3: Yup.string(),
    addressLine4: Yup.string(),
    postCode: Yup.string().required("Required"),
    email: Yup.string().required().email(),
    secondaryEmail: Yup.string().email(),
    weight: Yup.number().typeError("value must be a number in kg"),
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

  const numMarker = (num) => {
    return num === 1 ? "st" : num === 2 ? "nd" : "th";
  };
  let grade;
  if (member && member.kyuGrade === 0) {
    grade = `${member.danGrade}${numMarker(member.danGrade)} dan`;
  } else {
    grade = `${member.kyuGrade}${numMarker(member.kyuGrade)} kyu`;
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
          <h2 className="mt-2 border-bottom border-warning text-warning text-center">
            Welcome {member.firstName}!
          </h2>
          <p>
            This is your virtual dojo. Here you will find all of your details,
            training videos, orders and courses that you can register for. You
            can book classes, amend bookings, change your payment details and
            much more.
          </p>

          <ListGroup variant="flush">
            <Row>
              <Col sm={7} className="mb-3">
                <ListGroup.Item className="bg-light text-warning">
                  <strong>Name</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  {`${member.firstName} ${member.lastName}`}
                </ListGroup.Item>
                <ListGroup.Item className="bg-light text-warning">
                  <strong>Email</strong>
                </ListGroup.Item>
                <ListGroup.Item>{`${member.email}`}</ListGroup.Item>
                <ListGroup.Item className="bg-light text-warning">
                  <strong>Phone</strong>
                </ListGroup.Item>
                <ListGroup.Item>{`0${member.phone}`}</ListGroup.Item>

                <ListGroup.Item className="bg-light text-warning">
                  <strong>Grade</strong>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  {`${grade} (${member.gradeLevel})`}
                  <Button
                    variant="light"
                    className="btn-link px-4 text-warning"
                    onClick={() => {
                      setGradingModal(true);
                    }}
                  >
                    View Grading results
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light text-warning">
                  <strong>Membership Level</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  {(member.trainingFees / 100).toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </ListGroup.Item>
                <ListGroup.Item className="bg-light text-warning">
                  <strong>Free Class Credits</strong>
                </ListGroup.Item>
                <ListGroup.Item>
                  {member.freeClasses > 0
                    ? `${member.freeClasses} free class credits`
                    : "No free class credits"}
                </ListGroup.Item>
              </Col>

              {member.firstName && member.gradeLevel !== "Advanced" && (
                <Col sm={5} className="p-2 text-center">
                  <h5 className="mb-0 border-bottom border-warning">
                    Attendance Card
                  </h5>
                  {member.attendanceRecord === 0 ? (
                    <Message variant="info">
                      You currently have no attendance stamps. Your attendnace
                      card will appear here after your next class.
                    </Message>
                  ) : member.attendanceRecord < 0 ? (
                    <Message variant="danger">
                      You gained a conditional pass at your last grading, or
                      unfortunately failed your last grading, and so
                      consequently you will need to attend additional classes
                      before you can start collecting attendance stamps again.{" "}
                      <br />
                      Number of sessions to attend before collecting stamps
                      again: {member.attendanceRecord * -1}
                    </Message>
                  ) : member.attendanceRecord >
                    member.numberOfSessionsRequired ? (
                    <img
                      src={`/img/Stampcards/${member.gradeLevel}Card${member.numberOfSessionsRequired}.png`}
                      alt=""
                      className="max-width-300"
                    />
                  ) : (
                    <img
                      src={`/img/Stampcards/${member.gradeLevel}Card${member.attendanceRecord}.png`}
                      alt=""
                      className="max-width-300"
                    />
                  )}
                </Col>
              )}
            </Row>
            <ListGroup.Item className="mt-3" variant="light">
              <Row>
                <Col>
                  <Button
                    variant="outline-secondary"
                    className="btn-block w-100 mb-2"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="fas fa-tools"></i> Update details
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="outline-secondary"
                    className="btn-block w-100"
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
      <Modal show={showModal} size="lg" onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="text-white bg-primary">
          <Modal.Title className="text-white">Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={saveHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light mb-2 p-2">
                  <FormikControl
                    control="textarea"
                    label="Bio"
                    name="bio"
                    placeholder="Please enter a brief description of yourself"
                    rows="10"
                  />
                </div>
                <div className="py-3 border-bottom border-warning mb-3">
                  <div className="bg-light mb-2 p-2">
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
                  </div>
                </div>

                <div className="py-3 border-bottom border-warning mb-3">
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Email"
                      type="text"
                      name="email"
                      placeholder="Please enter your Email"
                    />
                  </div>
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Confirm Email"
                      type="text"
                      name="confirmEmail"
                      placeholder="Confirm Email"
                    />
                  </div>
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Secondary Email (optional)"
                      type="text"
                      name="secondaryEmail"
                      placeholder="Provide a secondary email address (optional)"
                    />
                  </div>
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Phone Number"
                      type="text"
                      name="phone"
                      placeholder="Please enter your phone number"
                    />
                  </div>
                </div>

                <div className="py-4 border-bottom border-warning">
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Name of emergency contact"
                      type="text"
                      name="emergencyContactName"
                      placeholder="Please enter their name"
                    />
                  </div>
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Email of emergency contact"
                      type="text"
                      name="emergencyContactEmail"
                      placeholder="Please enter their email"
                    />
                  </div>
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      label="Number of emergency contact"
                      type="text"
                      name="emergencyContactPhone"
                      placeholder="Please enter their number"
                    />
                  </div>
                </div>
                {member.squadMember && (
                  <div className="py-4 border-bottom border-warning">
                    <div className="bg-light mb-2 p-2">
                      <FormikControl
                        control="input"
                        label="Weight in kg"
                        type="text"
                        name="weight"
                        placeholder="Please enter your weight in kg."
                      />
                    </div>
                  </div>
                )}
                <Row className="mt-2">
                  <Col>
                    <Button
                      className="btn w-100 btn-primary m-0"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button type="submit" className="btn btn-default w-100">
                      Update
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
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Change Password</Modal.Title>
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
                    <div className="py-3 border-bottom border-warning mb-3">
                      <div className="bg-light mb-2 p-2">
                        <FormikControl
                          control="input"
                          label="Please enter current Password"
                          name="password"
                          type={showPassword}
                          placeholder="Enter Password"
                        />
                        {showPassword === "password" ? (
                          <small
                            onClick={() => setShowPassword("text")}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="fa-solid fa-eye inside-input"></i>{" "}
                            Show Passwords
                          </small>
                        ) : (
                          <small
                            onClick={() => setShowPassword("password")}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="fa-solid fa-eye-slash"></i> Hide
                            Passwords
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="bg-light mb-2 p-2">
                      <FormikControl
                        control="input"
                        label="Please set a new password"
                        name="newPassword"
                        type={showPassword}
                        placeholder="Set Password"
                      />
                      {showPassword === "password" ? (
                        <small
                          onClick={() => setShowPassword("text")}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa-solid fa-eye inside-input"></i> Show
                          Passwords
                        </small>
                      ) : (
                        <small
                          onClick={() => setShowPassword("password")}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa-solid fa-eye-slash"></i> Hide
                          Passwords
                        </small>
                      )}
                    </div>
                    <div className="bg-light mb-2 p-2">
                      <FormikControl
                        control="input"
                        label="Please confirm new password"
                        name="confirmNewPassword"
                        type={showPassword}
                        placeholder="Confirm password"
                      />
                      {showPassword === "password" ? (
                        <small
                          onClick={() => setShowPassword("text")}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa-solid fa-eye inside-input"></i> Show
                          Passwords
                        </small>
                      ) : (
                        <small
                          onClick={() => setShowPassword("password")}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="fa-solid fa-eye-slash"></i> Hide
                          Passwords
                        </small>
                      )}
                    </div>

                    <Row>
                      <Col>
                        <Button
                          variant="primary"
                          onClick={() => setShowPasswordModal(false)}
                          className="w-100"
                        >
                          Close
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="submit"
                          variant="default"
                          className="w-100"
                        >
                          Update
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
      <Modal show={gradingModal} onHide={() => setGradingModal(false)}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Your Grading Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="bg-warning p-2 text-white">
            How are gradings examined
          </h6>
          <p>
            Gradings are comprised of several elements, depending on grade.
            These elements are:
            <ul>
              <li>Kihon - The execution of basic techniques in reptition</li>
              <li>Kata - A complex sequence of kihon techniques</li>
              <li>
                Kihon Kumite - Execution of kihon techniques with a partner
              </li>
              <li>
                Shobu Kumite - free sparring conducted according to competition
                rules with the intention of scoring points
              </li>
            </ul>
          </p>
          <h6 className="bg-warning p-2 text-white">
            What is the scoring criteria
          </h6>
          <p>
            The assessor will award a score between 1 and 5 (1 = 'not meeting
            standard', 3 = 'meeting standard', 5 = exceeding standard) based on
            the following:
            <ul>
              <li>Conformity with the accepted standard of Shotokan Karate</li>
              <li>
                Zanshin - a Japanese word meaning a calm focus and awarenesss
              </li>
              <li>Vigorous application of technique</li>
              <li>
                Athletic performance, which would include such things as
                balance/speed/control
              </li>
            </ul>
          </p>

          <h6 className="bg-warning p-2 text-center text-white">Results</h6>
          <ListGroup>
            {gradingResults && gradingResults.length !== 0 ? (
              gradingResults.map((result, index) => {
                return (
                  <ListGroup.Item key={index}>
                    <p className="bg-primary p-2 text-white">
                      Date: {new Date(result.date).toLocaleDateString()}
                    </p>
                    <p>
                      Grade Attempted:{" "}
                      {result.gradeAchieved > 12 ? (
                        <>
                          {result.gradeAchieved}
                          {result.gradeAchieved === 1
                            ? "st"
                            : result.gradeAchieved === 2
                            ? "nd"
                            : "th"}{" "}
                          kyu
                          <small className="text-success">
                            score modifier for grade level +9
                          </small>
                        </>
                      ) : result.gradeAchieved > 11 ? (
                        <>
                          {result.gradeAchieved}
                          {result.gradeAchieved === 1
                            ? "st"
                            : result.gradeAchieved === 2
                            ? "nd"
                            : "th"}{" "}
                          kyu
                          <small className="text-success">
                            score modifier for grade level +3
                          </small>
                        </>
                      ) : (
                        <>
                          {result.gradeAchieved}
                          {result.gradeAchieved === 1
                            ? "st"
                            : result.gradeAchieved === 2
                            ? "nd"
                            : "th"}{" "}
                          kyu
                        </>
                      )}
                    </p>
                    <p>
                      Result Breakdown:
                      <ul>
                        <li>Kihon: {result.kihon}</li>
                        {result.gradeAchieved < 13 && (
                          <li>Kata: {result.kata}</li>
                        )}
                        {result.gradeAchieved < 13 && (
                          <li>Kihon Kumite: {result.kihonKumite}</li>
                        )}
                        {result.gradeAchieved < 10 && (
                          <li> Shobu Kumite: {result.shobuKumite}</li>
                        )}
                      </ul>
                    </p>
                    <p>
                      Overall Score:{" "}
                      {result.overallScore < 8 ? (
                        <div className="bg-danger text-white p-2">
                          {result.overallScore} - FAIL{" "}
                          <i className="fa-solid fa-xmark"></i>
                        </div>
                      ) : result.overallScore < 10 ? (
                        <div className="bg-warning text-white p-2">
                          {result.overallScore} - Conditional Pass{" "}
                          <i className="fa-solid fa-question"></i>
                        </div>
                      ) : result.overallScore < 17 ? (
                        <div className="bg-success text-white p-2">
                          {result.overallScore} - Pass{" "}
                          <i className="fa-solid fa-check"></i>
                        </div>
                      ) : (
                        <div className="bg-distinction text-white p-2">
                          {result.overallScore} - Pass with distinction{" "}
                          <i className="fa-solid fa-exclamation"></i>
                        </div>
                      )}
                    </p>
                  </ListGroup.Item>
                );
              })
            ) : (
              <p className="text-center">no results to show</p>
            )}
          </ListGroup>
          <small>Results are only available from the 25/03/23 onwards</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setGradingModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MemberDetails;
