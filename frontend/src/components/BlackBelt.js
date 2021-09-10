import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

const BlackBelt = ({ blackBelt }) => {
  const gradingDates = Object.entries(blackBelt.danGradings);
  let numberMarker;
  switch (blackBelt.danGrade) {
    case 1:
      numberMarker = "st";
      break;
    case 2:
      numberMarker = "nd";
      break;
    case 3:
      numberMarker = "rd";
      break;
    default:
      numberMarker = "th";
  }

  return (
    <Card className="blackbelt-card">
      <Card.Img variant="top" src={blackBelt.profileImg} alt="" />
      <Card.Body>
        <Card.Title className="text-center border-bottom border-warning pb-1">
          {blackBelt.firstName} {blackBelt.lastName}
        </Card.Title>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            Current Grade: {blackBelt.danGrade}
            {numberMarker} dan
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
    </Card>
  );
};

export default BlackBelt;
