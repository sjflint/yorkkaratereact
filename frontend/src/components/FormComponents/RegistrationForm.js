// import { useState } from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { Button, Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import "yup-phone";
import { register } from "../../actions/memberActions";

const RegistrationForm = () => {
  // Redux
  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);

  const { memberInfo } = memberLogin;

  // Component level state
  let history = useHistory();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (memberInfo) {
      window.location.href = `https://pay-sandbox.gocardless.com/flow/${memberInfo.ddRedirect}`;
    }
  }, [history, memberInfo]);

  // Form options
  const medicalOptions = [
    { key: "No", value: "No medical issues" },
    { key: "Yes", value: "Yes medical" },
  ];

  const termsOptions = [
    { key: "Agree to Terms and Conditions", value: "Agree" },
  ];

  // Formik init, val and submit
  const initialValues = {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    medicalStatus: "",
    medicalDetails: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    postCode: "",
    email: "",
    confirmEmail: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactEmail: "",
    emergencyContactPhone: "",
    termsOptions: [],
    classBookingOptions: [""],
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    dateOfBirth: Yup.date().required("Required"),
    medicalStatus: Yup.string().required("Required"),
    medicalDetails: Yup.string(),
    addressLine1: Yup.string().required("Required"),
    addressLine2: Yup.string(),
    addressLine3: Yup.string(),
    addressLine4: Yup.string().required("Required"),
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
        "Name cannot be the same as the applicant"
      ),
    emergencyContactEmail: Yup.string()
      .required("Required")
      .notOneOf(
        [Yup.ref("email"), null],
        "Email cannot be the same as the applicant"
      ),
    emergencyContactPhone: Yup.string()
      .required("Required")
      .phone("GB", true)
      .notOneOf(
        [Yup.ref("phone"), null],
        "Phone number cannot be the same as the applicant"
      ),
    termsOptions: Yup.array().length(
      1,
      "Please agree to our Terms & Conditions"
    ),
    password: Yup.string()
      .required("Required")
      .min(6, "Must be at least 6 characters")
      .matches(
        /(?=.*[0-9])(?=.*[a-z])/,
        "password must contain a combination of numbers and letters"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const onSubmit = (values) => {
    values.name = (values.firstName + values.lastName).toLowerCase().trim();
    values.firstName =
      values.firstName.charAt(0).toUpperCase() + values.firstName.slice(1);
    values.lastName =
      values.lastName.charAt(0).toUpperCase() + values.lastName.slice(1);
    dispatch(register({ ...values }));
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => (
          <Form>
            <Row className="py-4 border-bottom border-warning">
              <Col>
                <FormikControl
                  control="input"
                  type="text"
                  label="First Name"
                  name="firstName"
                  placeholder="First Name"
                />
              </Col>
              <Col>
                <FormikControl
                  control="input"
                  type="text"
                  label="Last Name"
                  name="lastName"
                  placeholder="Last Name"
                />
              </Col>
            </Row>
            <Row className="py-4 border-bottom border-warning">
              <Col>
                <FormikControl
                  control="input"
                  type="date"
                  label="Date of Birth"
                  name="dateOfBirth"
                />
              </Col>
              <Col>
                <FormikControl
                  control="radio"
                  label="Do you suffer from any medical conditions or disabilities that could affect you when practicing karate?"
                  name="medicalStatus"
                  options={medicalOptions}
                />
                {values.medicalStatus === "Yes medical" ? (
                  <FormikControl
                    control="input"
                    as="textarea"
                    label="Please provide further details"
                    name="medicalDetails"
                    placeholder="A brief description"
                  />
                ) : null}
              </Col>
            </Row>

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

            <Row className="py-4 border-bottom border-warning">
              <Col>
                <FormikControl
                  control="input"
                  label="Please set a password"
                  name="password"
                  type="password"
                  placeholder="Set Password"
                />
              </Col>
              <Col>
                <FormikControl
                  control="input"
                  label="Please confirm password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                />
              </Col>
            </Row>

            <Row className="py-4">
              <Col>
                <FormikControl
                  control="checkbox"
                  label="Terms and Conditions"
                  name="termsOptions"
                  options={termsOptions}
                />
              </Col>
              <Col className="align-self-center text-center">
                <Button
                  type="button"
                  variant="primary btn-block"
                  onClick={handleShow}
                >
                  View Terms & Conditions
                </Button>
              </Col>
            </Row>

            <Button type="submit" variant="warning btn-block">
              Register
            </Button>
          </Form>
        )}
      </Formik>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="bg-warning text-white" closeButton>
          <Modal.Title>Terms and Conditions of Membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By completing the York Karate Club application form, and ticking the
            select box stating that I accept these terms and conditions, I
            understand that I am agreeing to, and will be bound by, the Terms
            and Conditions stated below. Copies of the Club's Child Protection
            policy, Code of Conduct and Safe in Care guidelines are available
            from www.yorkkarate.net.
          </p>
          <p>A. CONSENT - CLUB CODE OF CONDUCT AND CHILD PROTECTION</p>
          <p>
            I consent/my child(ren) consent to abide by the Club's Code of
            Conduct and understand and accept the disciplinary procedures that
            may be brought against me should I fail to do so. I also consent to
            abide by the Club's Child Protection Policy and fulfil all duties
            expected of me. I will further promote both the Code of Conduct and
            the Child Protection policy within the club.
          </p>
          <p>B. CONSENT - MEDICAL TREATMENT</p>
          <p>
            I consent/my child(ren) consent to receiving medical treatment,
            including anaesthetic, which the medical professionals present
            consider necessary.
          </p>
          <p>C. CONSENT - TRANSPORTATION OF CHILDREN</p>
          <p>
            I consent/my child(ren) consent to being transported by persons
            representing York Karate, individual members or affiliated clubs for
            the purposes of taking part in Karate. I understand York Karate will
            ask any person using a private vehicle to declare that they are
            properly licensed and insured and, in the case of a person who
            cannot so declare, will not permit that individual to transport
            children.
          </p>
          <p>D. CONSENT - PHOTOGRAPHS AND PUBLICATIONS (INCLUDING WEBSITE)</p>
          <p>
            You/your child may be photographed or filmed when participating in
            Karate. I consent/my child(ren) consent to being involved in
            photographing/filming and for such images and videos to be used for
            marketing and advertising purposes, in accordance with York Karate's
            policies.
          </p>
          <p>E. CONSENT - CONTACT INFORMATION</p>
          <p>
            York Karate may contact your child from time to time via email, text
            or social networking site if such contact details have been provided
            to the Club. I consent/my child(ren) consent to being contacted via
            email, text or social networking site for the purposes stated in
            York Karate's Child Protection Policy.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RegistrationForm;
