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
          console.log(error);
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
          <FormikControl
            control="input"
            type="text"
            label="Name"
            name="name"
            placeholder="Please enter your name"
          />
          <FormikControl
            control="input"
            type="email"
            label="Email"
            name="email"
            placeholder="email"
          />
          <FormikControl
            control="input"
            type="text"
            label="Phone"
            name="phone"
            placeholder="Please enter your phone number"
          />
          <FormikControl
            control="select"
            label="Age Group"
            name="ageGroup"
            options={dropdownOptions}
          />
          <FormikControl
            control="textarea"
            label="Message"
            name="message"
            placeholder="Please enter a brief description of how we can help you"
          />

          <button type="submit" className="mt-1 btn-block btn-default btn">
            Submit
          </button>
        </Form>
      </Formik>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-warning text-white">
          <Modal.Title>Message Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Thank you for contacting York Karate. We will review your enquiry and
          reply to you in due course.
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

export default EnquiryForm;
