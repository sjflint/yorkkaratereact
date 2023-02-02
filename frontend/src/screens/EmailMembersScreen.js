import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import FormikControl from "../components/FormComponents/FormikControl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import UploadFile from "../components/UploadFile";
import { UPLOAD_FILE_CLEAR } from "../constants/uploadFileConstants";
import { emailSend } from "../actions/sendEmailAction";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listEnquiries } from "../actions/enquiryActions";

const EmailMembersScreen = ({ history }) => {
  const [file, setFile] = useState();
  const [sendNewEmail, setSendNewEmail] = useState(false);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  const singleFileData = (singleFile) => {
    setFile(singleFile);
  };

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  const sendEmail = useSelector((state) => state.sendEmail);
  const { loading: emailLoading, error: emailError, success } = sendEmail;

  const enquiryList = useSelector((state) => state.enquiryList);
  const {
    loading: enquiryLoading,
    error: enquiryError,
    enquiries,
  } = enquiryList;

  useEffect(() => {
    dispatch(listEnquiries());
    if (!memberInfo) {
      history.push("/login?redirect=/admin/emailmembers");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      // get what info we need for this page
      dispatch(listTrainingSessions());
    }
  }, [memberInfo, dispatch, file, history, sendNewEmail]);

  // Form details
  let classOptions = [{ key: "Please select", value: "" }];
  if (trainingSessions) {
    trainingSessions.forEach((trainingSession) => {
      const option = {
        key: trainingSession.name + " " + trainingSession.location,
        value: trainingSession._id,
      };
      classOptions.push(option);
    });
  }

  const recipientGroup = [
    { key: "Please select", value: "" },
    { key: "To Everyone", value: "all" },
    { key: "To a specific Grade Group", value: "grade" },
    { key: "To all squad members", value: "squad" },
    { key: "To a specific class", value: "class" },
  ];

  const grade = [
    { key: "Please select grade range", value: "" },
    { key: "Junior (under 9's and below 9th kyu)", value: "junior" },
    {
      key: "Novive (over 9's or above 10th kyu, but below 6th kyu)",
      value: "novice",
    },
    {
      key: "Intermediate & advanced (above 7th kyu)",
      value: "intermediate/advanced",
    },
    { key: "Black belts", value: "blackbelts" },
  ];

  const initialValues = {
    recipientGroup: "",
    gradeRange: "",
    classId: "",
    subject: "",
    message: "",
    link: "www.yorkkarate.net",
    linkText: "yorkkarate.net",
    id: "",
  };

  const validationSchema = Yup.object({
    recipientGroup: Yup.string(),
    gradeRange: Yup.string(),
    classId: Yup.string(),
    subject: Yup.string().required("Required"),
    message: Yup.string().required("Required"),
    link: Yup.string().required("Required"),
    linkText: Yup.string().required("Required"),
  });

  const onSubmit = (values) => {
    if (values.gradeRange === "junior") {
      values.minGrade = 16;
      values.maxGrade = 10;
    }
    if (values.gradeRange === "novice") {
      values.minGrade = 9;
      values.maxGrade = 7;
    }
    if (values.gradeRange === "intermediate/advanced") {
      values.minGrade = 6;
      values.maxGrade = 0;
    }
    if (values.gradeRange === "blackbelts") {
      values.minGrade = 0;
      values.maxGrade = 0;
    }
    if (values.attachments) {
      values.attachments = [
        {
          fileName: file,
          path: file,
        },
      ];
    }
    if (sendNewEmail === false) {
      values.email = enquiries[index].email;
      values._id = enquiries[index]._id;
      values.recipientGroup = "enquiry";
    }
    dispatch(emailSend(values));
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
      </div>
      <h3 className="text-center border-bottom border-warning pb-1">
        Send Emails
      </h3>
      {success ? (
        <div className="text-center">
          <h3 className="text-success">
            <i className="fa-solid fa-circle-check fa-3x"></i>
            <br />
            Email sent
          </h3>
          <Button
            variant="outline-secondary my-0"
            onClick={() => window.location.reload()}
          >
            Send another email
          </Button>
        </div>
      ) : (
        <>
          {!sendNewEmail ? (
            <div className="d-flex">
              <h5 className="border border-primary border-bottom-0 p-2">
                Enquiries
              </h5>
              <h6
                style={{ cursor: "pointer" }}
                onClick={() => setSendNewEmail(true)}
                className="border-primary border-bottom p-2 text-muted"
              >
                Send Group Emails
              </h6>
            </div>
          ) : (
            <div className="d-flex">
              <h6
                style={{ cursor: "pointer" }}
                onClick={() => setSendNewEmail(false)}
                className="border-primary border-bottom p-2 text-muted"
              >
                Enquiries
              </h6>
              <h5 className="border border-primary border-bottom-0 p-2">
                Send Group Emails
              </h5>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <Form>
                <div className="py-4 border-bottom border-warning">
                  <Row>
                    {sendNewEmail && (
                      <Col md={6}>
                        <div className="bg-light mb-2 p-2">
                          <FormikControl
                            control="select"
                            label="Recipient Group"
                            name="recipientGroup"
                            options={recipientGroup}
                          />
                        </div>
                      </Col>
                    )}
                    {enquiryLoading ? (
                      <Loader variant="warning" />
                    ) : enquiryError ? (
                      <Message variant="warning">{enquiryError}</Message>
                    ) : (
                      <>
                        {!sendNewEmail && enquiries && enquiries[0] ? (
                          <>
                            <div className="d-flex justify-content-center align-items-center">
                              {index > 0 && (
                                <Button
                                  variant="warning btn-sm py-0"
                                  onClick={() => setIndex(index - 1)}
                                >
                                  Previous
                                </Button>
                              )}
                              <h5 className="py-0 my-0 px-3">
                                {index + 1} / {enquiries.length}
                              </h5>

                              {index + 1 < enquiries.length && (
                                <Button
                                  variant="warning btn-sm py-0"
                                  onClick={() => setIndex(index + 1)}
                                >
                                  Next
                                </Button>
                              )}
                            </div>
                            <ListGroup
                              className="border border-primary m-2"
                              variant="flush"
                            >
                              <ListGroup.Item>
                                Name: {enquiries[index].name}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Age Group: {enquiries[index].ageGroup}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Email: {enquiries[index].email}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Phone: {enquiries[index].phone}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                Date submitted:{" "}
                                {new Date(
                                  enquiries[index].dateCreated
                                ).toDateString()}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <p style={{ whiteSpace: "pre-line" }}>
                                  {enquiries[index].message}
                                </p>
                              </ListGroup.Item>
                            </ListGroup>
                          </>
                        ) : (
                          enquiries.length > 0 ||
                          (sendNewEmail === false && (
                            <div className="d-flex text-success align-items-center my-5 bg-dark">
                              <i className="fa-solid fa-circle-check fa-2x my-3"></i>
                              <br />
                              <p className="m-2">
                                You're done - No Enquiries to respond to.
                              </p>
                            </div>
                          ))
                        )}
                      </>
                    )}
                  </Row>

                  {values.recipientGroup === "grade" ? (
                    <Row>
                      <Col md={6}>
                        <div className="bg-light mb-2 p-2">
                          <FormikControl
                            control="select"
                            label="Grade Range"
                            name="gradeRange"
                            options={grade}
                          />
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    values.recipientGroup === "class" &&
                    (loading ? (
                      <Loader variant="warning" />
                    ) : error ? (
                      <Message>{error}</Message>
                    ) : (
                      <Row>
                        <Col md={6}>
                          <div className="bg-light mb-2 p-2">
                            <FormikControl
                              control="select"
                              label="Class"
                              name="classId"
                              options={classOptions}
                            />
                          </div>
                        </Col>
                      </Row>
                    ))
                  )}

                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      type="text"
                      label="Subject"
                      name="subject"
                      placeholder="Subject..."
                    />
                  </div>
                  <div className="bg-light mb-2 p-2">
                    <FormikControl
                      control="input"
                      as="textarea"
                      label="Message"
                      name="message"
                      placeholder="Message..."
                    />
                  </div>
                </div>

                <Row className="py-4 border-bottom border-warning">
                  <p className="mb-1 mt-2">
                    Add link for further information, or to register etc...
                  </p>
                  <Col md={6}>
                    <div className="bg-light mb-2 p-2">
                      <FormikControl
                        control="input"
                        type="text"
                        label="Name of link"
                        name="linkText"
                        placeholder="The text to appear on the link button..."
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light mb-2 p-2">
                      <FormikControl
                        control="input"
                        type="text"
                        label="Link for further information"
                        name="link"
                        placeholder="https://examplelink.com"
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="py-4 border-bottom border-warning">
                  {!file || file === "loading" ? (
                    <Col md={6}>
                      <UploadFile
                        singleFileData={singleFileData}
                        buttonText="Attach file"
                      />
                    </Col>
                  ) : (
                    <Col md={6}>
                      <p>{file}</p>
                      <Button
                        onClick={() => {
                          dispatch({ type: UPLOAD_FILE_CLEAR });
                          setFile(null);
                        }}
                      >
                        Change Attached File
                      </Button>
                    </Col>
                  )}
                </Row>

                <Row>
                  <Col md={3}></Col>
                  <Col md={6}>
                    {emailLoading ? (
                      <Loader variant="warning" />
                    ) : emailError ? (
                      <Message>{emailError}</Message>
                    ) : (
                      <Button
                        type="submit"
                        variant="link btn-block w-100 py-0 mt-2"
                      >
                        Send email
                      </Button>
                    )}
                  </Col>
                  <Col md={3}></Col>
                </Row>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Container>
  );
};

export default EmailMembersScreen;
