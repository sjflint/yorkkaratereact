import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editMember, getMemberDetails } from "../actions/memberActions";
import * as Yup from "yup";
import { Col, Container, Row, Button, Modal, ListGroup } from "react-bootstrap";
import { Form, Formik } from "formik";
import FormikControl from "../components/FormComponents/FormikControl";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { EDIT_MEMBER_RESET } from "../constants/memberConstants";
import MemberTrainingSessions from "../components/MemberTrainingSessions";
import { listMemberClasses } from "../actions/trainingSessionActions";
import { Link } from "react-router-dom";

import UploadImage from "../components/uploadImage";
import AttRecord from "../components/AttRecord";
import { ATTENDANCE_MEMBER_LIST_RESET } from "../constants/attendanceConstants";

const MemberEditScreen = ({ match, history }) => {
  const [showModal, setShowModal] = useState(false);
  const [gradingDate, setGradingDate] = useState();
  const [danGrade, setDanGrade] = useState();
  const [attRecordModal, setAttRecordModal] = useState(false);

  const dispatch = useDispatch();

  const singleImageData = (img) => {
    console.log(`Uploading Img ${img}`);
  };

  const memberId = match.params.id;

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading, error, member } = memberDetails;

  const memberEdit = useSelector((state) => state.memberEdit);
  const { success } = memberEdit;

  const memberClassList = useSelector((state) => state.memberClassList);
  const { loading: classListLoading, error: classListError } = memberClassList;

  useEffect(() => {
    dispatch({ type: EDIT_MEMBER_RESET });

    if (!memberInfo) {
      history.push(`/login?redirect=admin/members/${match.params.id}/edit`);
    } else if (memberInfo.isAdmin || memberInfo.isInstructor) {
      console.log("authorised as instructor/admin");
      dispatch(getMemberDetails(memberId));
      dispatch(listMemberClasses(memberId));
    } else {
      history.push("/profile");
    }
  }, [
    dispatch,
    memberInfo,
    history,
    memberId,
    member.profileImg,
    match.params.id,
  ]);

  const adminOptions = [
    {
      key: "True",
      value: "true",
    },
    { key: "False", value: "false" },
  ];

  let initialValues;
  let numberMarker;
  let numberMarker2;

  switch (danGrade) {
    case 1:
      numberMarker2 = "st";
      break;
    case 2:
      numberMarker2 = "nd";
      break;
    case 3:
      numberMarker2 = "rd";
      break;
    default:
      numberMarker2 = "th";
  }

  if (member.dateOfBirth) {
    switch (member.danGrade) {
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
    initialValues = {
      kyuGrade: member.kyuGrade,
      danGrade: member.danGrade,
      isAdmin: member.isAdmin.toString(),
      isShopAdmin: member.isShopAdmin.toString(),
      isAuthor: member.isAuthor.toString(),
      isInstructor: member.isInstructor.toString(),
      squadMember: member.squadMember.toString(),
      weight: member.weight,
      firstName: member.firstName,
      lastName: member.lastName,
      dateOfBirth: member.dateOfBirth.substring(0, 10),
      medicalDetails: member.medicalDetails,
      addressLine1: member.addressLine1,
      addressLine2: member.addressLine2,
      addressLine3: member.addressLine3,
      addressLine4: member.addressLine4,
      postCode: member.postCode,
      email: member.email,
      secondaryEmail: member.secondaryEmail,
      phone: `0${member.phone}`,
      emergencyContactName: member.emergencyContactName,
      emergencyContactEmail: member.emergencyContactEmail,
      emergencyContactPhone: `0${member.emergencyContactPhone}`,
      danGradings: member.danGradings,
      squadDiscipline: member.squadDiscipline,
    };
  }

  const validationSchema = Yup.object({
    kyuGrade: Yup.number().required("Required").moreThan(-1).lessThan(17),
    danGrade: Yup.number().required("Required").lessThan(11).moreThan(-1),
    weight: Yup.number().typeError("a number value must be entered in kg"),
    isAdmin: Yup.boolean().required("Required"),
    isShopAdmin: Yup.boolean().required("Required"),
    isAuthor: Yup.boolean().required("Required"),
    isInstructor: Yup.boolean().required("Required"),
    squadMember: Yup.boolean().required("Required"),
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    dateOfBirth: Yup.date().required("Required"),
    addressLine1: Yup.string().required("Required"),
    postCode: Yup.string().required("Required"),
    email: Yup.string().required().email(),
    secondaryEmail: Yup.string().email(),
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

  const saveHandler = async (values) => {
    values.memberId = memberId;
    let numberMarker;
    switch (danGrade) {
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

    if (member) {
      if (member.kyuGrade > 10) {
        values.gradeLevel = "Junior";
      } else if (member.kyuGrade > 6) {
        values.gradeLevel = "Novice";
      } else if (member.kyuGrade > 1) {
        values.gradeLevel = "Intermediate";
      } else {
        values.gradeLevel = "Advanced";
      }
    }

    if (gradingDate && danGrade) {
      values.danGradings[
        danGrade + numberMarker + " Dan"
      ] = `${gradingDate.substring(8, 10)}/${gradingDate.substring(
        5,
        7
      )}/${gradingDate.substring(0, 4)}`;
      values.danGrade = danGrade;
      values.kyuGrade = 0;
    }

    console.log(values.medicalDetails);

    if (!values.medicalDetails || values.medicalDetails === "-") {
      values.medicalStatus = "false";
    } else {
      values.medicalStatus = "Yes medical";
    }

    if (
      values.squadMember === "true" &&
      typeof values.squadDiscipline !== "object"
    ) {
      console.log("create squad discipline object");
      values.squadDiscipline = {
        kata: true,
        kumite: true,
      };
    }

    await dispatch(editMember(values));

    setTimeout(() => history.goBack(), 1000);
  };

  return (
    <Container className="mt-3">
      {memberInfo && (
        <>
          {!memberInfo.isAdmin && (
            <Message variant="danger">
              Viewing as Instructor. Please note: Only admins can edit member's
              details. Any changes you make will not be saved or updated.
            </Message>
          )}
          {loading ? (
            <Loader variant="warning" />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              <Link
                className="btn btn-outline-secondary py-0 mb-2"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left"></i> Return
              </Link>
              <h3 className="text-center border-bottom border-warning pb-1">
                Membership details for {member.firstName} {member.lastName}
              </h3>

              {initialValues ? (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={saveHandler}
                >
                  {({ values }) => (
                    <Form className="text-muted">
                      <h5>Personal Details</h5>
                      <Row className="pb-4 border-bottom border-warning">
                        <Col md={6}>
                          <div className="max-width-300 mx-auto mb-3 bg-light p-2">
                            <UploadImage
                              img={member.profileImg}
                              id={member._id}
                              type={"Profile"}
                              singleImageData={singleImageData}
                            />
                            <small className="text-center">
                              Please consider that this image might be displayed
                              across the public website, as well as being
                              displayed to grading examinars.
                            </small>
                          </div>
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              label="First Name"
                              type="text"
                              name="firstName"
                            />
                          </div>
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              label="Last Name"
                              type="text"
                              name="lastName"
                            />
                          </div>
                        </Col>
                        <Col md={6}>
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
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              label="Email"
                              type="text"
                              name="email"
                              placeholder="Please enter an Email"
                            />
                          </div>
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              label="Secondary Email (optional)"
                              type="text"
                              name="secondaryEmail"
                              placeholder="Please enter a secondary email (optional)"
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
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              type="date"
                              label="Date of Birth"
                              name="dateOfBirth"
                            />
                          </div>
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              as="textarea"
                              label="Medical Details"
                              name="medicalDetails"
                              placeholder="Provide any important medical information here"
                            />
                          </div>
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="input"
                              label="Weigth (kg)"
                              type="text"
                              name="weight"
                              placeholder="Please enter your current weight in kg"
                            />
                          </div>
                        </Col>
                      </Row>

                      <div className="py-4 border-bottom border-warning">
                        <h5>Emergency Contact Details</h5>
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
                      <div className="py-4 border-bottom border-warning">
                        <h5>Membership Status and Permissions</h5>
                        <Row className="mt-2">
                          {member && member.kyuGrade === 0 ? (
                            <Col md={4}>
                              <div className="border border-warning p-1">
                                <h5 className="text-center">
                                  Current Dan Grade:{" "}
                                  {`${member.danGrade}${numberMarker} Dan`}
                                </h5>
                                {danGrade && gradingDate ? (
                                  <ListGroup>
                                    <ListGroup.Item
                                      variant="success"
                                      className="text-center strong"
                                    >
                                      Dan Grade set to{" "}
                                      {`${danGrade}${numberMarker2} Dan`}
                                    </ListGroup.Item>
                                  </ListGroup>
                                ) : (
                                  <Button
                                    variant="outline-secondary"
                                    className="text-center w-100 py-0"
                                    onClick={() => setShowModal(true)}
                                  >
                                    Add Dan grading
                                  </Button>
                                )}
                              </div>
                            </Col>
                          ) : (
                            <Col md={4}>
                              <div className="border border-warning p-1">
                                <FormikControl
                                  control="input"
                                  label="Kyu Grade"
                                  type="number"
                                  name="kyuGrade"
                                />
                              </div>
                              <p className="text-center my-2">
                                If not a kyu grade, enter 0 for the kyu grade
                                value
                              </p>
                            </Col>
                          )}
                          <Col md={4}>
                            <div className="border border-warning p-1">
                              <FormikControl
                                control="radio"
                                label="Squad member?"
                                name="squadMember"
                                options={adminOptions}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row className="mt-2 g-0">
                          <Col md={3}>
                            <div className="border border-warning p-1">
                              <FormikControl
                                control="radio"
                                label="Admin user?"
                                name="isAdmin"
                                options={adminOptions}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="border border-warning p-1">
                              <FormikControl
                                control="radio"
                                label="Shop Admin user?"
                                name="isShopAdmin"
                                options={adminOptions}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="border border-warning p-1">
                              <FormikControl
                                control="radio"
                                label="Instructor user?"
                                name="isInstructor"
                                options={adminOptions}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <div className="border border-warning p-1">
                              <FormikControl
                                control="radio"
                                label="Author user?"
                                name="isAuthor"
                                options={adminOptions}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="py-4 border-bottom border-warning">
                        <h5>Classes</h5>
                        {classListLoading ? (
                          <Loader />
                        ) : classListError ? (
                          <Message>{error}</Message>
                        ) : (
                          <MemberTrainingSessions />
                        )}
                      </div>
                      <div className="py-4 border-bottom border-warning">
                        <h5>Attendance Record</h5>
                        <Button
                          onClick={() => {
                            dispatch({ type: ATTENDANCE_MEMBER_LIST_RESET });
                            setAttRecordModal(true);
                          }}
                        >
                          View Attendance Record
                        </Button>
                      </div>

                      <Row className="mt-2">
                        {!memberInfo.isAdmin ? (
                          <Button
                            variant="default"
                            type="submit"
                            className="w-100"
                            disabled
                          >
                            Update disabled
                          </Button>
                        ) : (
                          <Col>
                            {success ? (
                              <Button
                                className="btn btn-success w-100"
                                disabled
                              >
                                Updated
                              </Button>
                            ) : (
                              <Button
                                variant="default"
                                type="submit"
                                className="w-100"
                              >
                                Update
                              </Button>
                            )}
                          </Col>
                        )}
                      </Row>
                    </Form>
                  )}
                </Formik>
              ) : (
                <>
                  <h5 className="text-center text-warning">
                    Error loading details. Please don't use the refresh button.
                  </h5>
                  <Link
                    className="btn btn-block btn-warning my-3"
                    to="/admin/listMembers"
                  >
                    Return to Member List
                  </Link>
                </>
              )}
            </>
          )}
          <Modal
            size="sm"
            show={showModal}
            onHide={() => setShowModal(false)}
            aria-labelledby="title-sm"
          >
            <Modal.Header closeButton className="bg-primary">
              <Modal.Title id="title-sm" className="text-white">
                Date of dan grading
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-1">
                Please enter the date the member passed their grading
              </p>
              <form>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control"
                    value={gradingDate}
                    onChange={(e) => setGradingDate(e.target.value)}
                  />
                </div>
              </form>
              <Modal.Footer>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => {
                    setShowModal(false);
                    setDanGrade(member.danGrade + 1);
                  }}
                >
                  Add grading date
                </Button>
                <Button
                  className="mr-2 w-100"
                  variant="danger"
                  onClick={() => {
                    setShowModal(false);
                    setGradingDate();
                  }}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
          <Modal
            show={attRecordModal}
            onHide={() => setAttRecordModal(false)}
            aria-labelledby="title-sm"
          >
            <Modal.Header closeButton className="bg-primary">
              <Modal.Title id="title-sm" className="text-white">
                Attendance Record
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-1">Attendance Record</p>
              {/* att Record */}
              <AttRecord id={member._id} numRecords={-5} />
              <Modal.Footer>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => {
                    setAttRecordModal(false);
                  }}
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default MemberEditScreen;
