import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import templeIMG from "../img/temple.jpg";

const memberApplicationScreen = () => {
  return (
    <Container>
      <h3 className="text-center border-bottom border-warning pb-1 mb-5">
        Before you apply...
      </h3>
      <Row className="no-gutters text-center">
        <Col md={5}>
          <img src={templeIMG} alt="" />
        </Col>
        <Col md={7} className="d-flex">
          <Card className="text-white bg-primary flex-fill">
            <Card.Header>Our Trial offer!</Card.Header>
            <Card.Body>
              <Card.Title className="border-bottom border-warning">
                Contact us for your two session free trial
              </Card.Title>
              <Card.Text>
                Don't pay for anything until you try the class first. Contact us
                to book two completely free taster sessions. No commitment.
              </Card.Text>
              <Link to={"/contact"} className="btn btn-warning btn-block">
                Book Your Trial sessions
              </Link>
              <Card.Title className="mt-2 border-bottom border-warning">
                Fees
              </Card.Title>
              <Card.Text className="text-left">
                <li>£15.00 annual membership</li>
                <li>£21.50 p/m to train once a week</li>
                <li>+£3.00 p/m for each additional class per week</li>
              </Card.Text>
              <Link to={"/register"} className="btn btn-warning btn-block">
                Proceed with application
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default memberApplicationScreen;
