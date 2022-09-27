import React from "react";
import EnquiryForm from "../components/FormComponents/EnquiryForm";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const ContactScreen = () => {
  return (
    <Container className="mt-3">
      <Row>
        <Col md={6} className="p-2">
          <h3>Benefits of training with York Karate Dojo:</h3>
          <ListGroup className="mb-4">
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Self-defence
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Improve fitness, conditioning and flexibility
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Discipline
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Improve confidence by building inner strength
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Achieve sporting success, at every level of the sport
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Learn a new skill
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Earn a genuine black belt, recognised by the Japanese Government
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Meet new friends
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
            <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
              Have fun!
              <span>
                <i className="fas fa-check-circle text-success fa-2x"></i>
              </span>
            </ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={6} className="bg-dark p-2">
          <h3 className="text-white">
            Let us know how we can help and we will get back to you:
          </h3>
          <EnquiryForm />
          <small className="text-white">
            Would You like to try a session first to see what you think?
          </small>
          <Link
            to={"/trialregistration"}
            className="btn btn-default btn-block w-100"
          >
            Book A Trial session Today
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactScreen;
