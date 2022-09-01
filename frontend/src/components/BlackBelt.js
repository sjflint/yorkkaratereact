import React from "react";
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  ListGroup,
  ListGroupItem,
  Modal,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPublicMemberDetails } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const BlackBelt = ({ blackBelt }) => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const memberPublicDetails = useSelector((state) => state.memberPublicDetails);
  const { loading, error, member } = memberPublicDetails;

  const gradingDates = Object.entries(blackBelt.danGradings);

  return (
    <>
      <Card>
        <Card.Img variant="top" src={blackBelt.profileImg} alt="" />
        <Card.Body>
          <Card.Title className="text-center border-bottom border-warning pb-1">
            {blackBelt.firstName} {blackBelt.lastName}
          </Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              Current Grade: {blackBelt.danGrade}
              {blackBelt.danGrade === 1
                ? "st"
                : blackBelt.danGrade === 2
                ? "nd"
                : blackBelt.danGrade === 3
                ? "rd"
                : "th"}{" "}
              dan
            </ListGroupItem>

            {gradingDates.map((grading) => {
              return (
                <ListGroupItem
                  key={Math.random()}
                >{`${grading[0]}: ${grading[1]}`}</ListGroupItem>
              );
            })}
          </ListGroup>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button
            variant="outline-secondary"
            onClick={() => {
              dispatch(getPublicMemberDetails(blackBelt._id));
              setShowModal(true);
            }}
          >
            View Profile
          </Button>
        </Card.Footer>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Public Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Loader variant="warning" />
          ) : error ? (
            <Message variant="warning">{error}</Message>
          ) : (
            <>
              <Row className="bg-dark text-white p-2 mb-1">
                <Col>
                  <img src={member.profileImg} alt="" />
                </Col>
                <Col>
                  <p>
                    Name:
                    <br /> {`${member.firstName} ${member.lastName}`}
                  </p>
                  <p>
                    Started Training:
                    <br />
                    {new Date(member.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    Current Grade:
                    <br />
                    {member.danGrade}
                    {member.danGrade === 1
                      ? "st"
                      : member.danGrade === 2
                      ? "nd"
                      : member.danGrade === 3
                      ? "rd"
                      : "th"}{" "}
                    dan
                  </p>
                  <p>{member.isInstructor && "Qualified Club Instructor"}</p>
                </Col>
              </Row>
              <h5 className="underline">
                <u>Biography</u>
              </h5>
              <p style={{ whiteSpace: "pre-line" }}>{member.bio}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlackBelt;
