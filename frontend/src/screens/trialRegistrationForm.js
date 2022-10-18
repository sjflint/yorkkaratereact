import React from "react";
import { Container } from "react-bootstrap";
import TrialRegistrationForm from "../components/FormComponents/TrialRegistrationForm";

const trialRegistrationForm = () => {
  return (
    <Container>
      <h3 className="text-center border-bottom border-warning py-1">
        Register For a Trial Session
      </h3>
      <TrialRegistrationForm />
    </Container>
  );
};

export default trialRegistrationForm;
