import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import kihonKumiteIMG from "../img/kihonkumite.jpg";

const memberApplicationScreen = () => {
  return (
    <Container className="mt-3">
      <h3 className="text-center border-bottom border-warning pb-1 mb-3">
        Before you apply...
      </h3>
      <Row className="no-gutters text-center bg-primary align-items-center p-3">
        <Col sm={5}>
          <img src={kihonKumiteIMG} alt="" className="max-width-300" />
        </Col>
        <Col sm={7} className="d-flex">
          <Card className="text-white bg-primary flex-fill">
            <Card.Header>Our Trial offer!</Card.Header>
            <Card.Body>
              <Card.Title className="border-bottom border-warning">
                Contact us for your free trial session
              </Card.Title>
              <Card.Text>
                Don't pay for anything until you try the class first. Contact us
                to book a taster session. No commitment.
              </Card.Text>
              <Link
                to={"/trialregistration"}
                className="btn btn-default btn-block btn-sm"
              >
                Book Your Trial session
              </Link>
              <Card.Title className="mt-4 border-bottom border-warning">
                Fees
              </Card.Title>
              <Card.Text>
                <ul className="list-unstyled">
                  <li>£15.00 annual membership</li>
                  <li>£21.50 p/m to train once a week</li>
                  <li>+ £3.00 p/m for each additional class per week</li>
                </ul>
              </Card.Text>
              <Link
                to={"/register"}
                className="btn btn-default btn-block btn-sm"
              >
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
