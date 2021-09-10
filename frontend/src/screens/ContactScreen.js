import React from "react";
import EnquiryForm from "../components/FormComponents/EnquiryForm";
import { Container } from "react-bootstrap";

const ContactScreen = () => {
  return (
    <Container>
      <h3>Let us know how we can help and we will get back to you:</h3>
      <EnquiryForm />
    </Container>
  );
};

export default ContactScreen;
