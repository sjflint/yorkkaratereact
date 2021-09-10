import React from "react";
import { Container } from "react-bootstrap";

const AfterSchoolScreen = () => {
  return (
    <Container>
      <h3 className="text-center border-bottom border-warning pb-1">
        After School Program
      </h3>
      <p className="text-center">
        Due to the current Covid-19 pandemic, schools in York have taken the
        reasonable decision to temporarily suspend all outside education
        providers. We hope to resume our after school program soon and will
        provide details here in due course.
      </p>
    </Container>
  );
};

export default AfterSchoolScreen;
