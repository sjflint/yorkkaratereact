import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const FormContainer = ({ children }) => {
  return (
    <Container className="mt-3">
      <Row>
        <Col xs={12} md={8} className="mx-auto">
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
