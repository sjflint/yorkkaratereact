import { useState } from "react";
import { Formik, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import "yup-phone";
import axios from "axios";

const EnquiryForm = () => {
  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showError, setShowError] = useState(false);

  const dropdownOptions = [
    { key: "Please select an age group", value: "" },
    { key: "Under 9 years old", value: "under 9 years old" },
    { key: "9 - 15 years old", value: "9 - 15 years old" },
    { key: "16 years +", value: "16 years +" },
  ];
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
    ageGroup: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().required("Required").email(),
    phone: Yup.string().required("Required").phone("GB", true),
    message: Yup.string().required("Required"),
    ageGroup: Yup.string().required("Required"),
  });
  const onSubmit = (values, onSubmitProps) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(
        "/sendEnquiry",
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          ageGroup: values.ageGroup,
        },
        config
      )
      .then(
        (response) => {
          // sent success model
          handleShow();
          onSubmitProps.resetForm();
        },
        (error) => {
          setShowError(true);
        }
      );
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form
          className="py-2 d-flex flex-column"
          id="enquiryform"
          name="enquiryform"
          action="sendEnquiry"
          method="POST"
        >
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="text"
              label="Name"
              name="name"
              placeholder="Please enter your name"
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="email"
              label="Email"
              name="email"
              placeholder="email"
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="text"
              label="Phone"
              name="phone"
              placeholder="Please enter your phone number"
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="select"
              label="Age Group"
              name="ageGroup"
              options={dropdownOptions}
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="textarea"
              label="Message"
              name="message"
              placeholder="Please enter a brief description of how we can help you"
            />
          </div>

          <button type="submit" className="mt-1 btn-block btn-default btn">
            Submit
          </button>
        </Form>
      </Formik>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Message Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Thank you for contacting York Karate. We will review your enquiry and
          reply to you in due course.
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showError} onHide={() => setShowError(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">Message Not sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Unfortuantely, your message could not be sent. Please check your
          details and try again.
        </Modal.Body>
        <Modal.Footer className="bg-danger">
          <Button variant="secondary" onClick={() => setShowError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnquiryForm;
