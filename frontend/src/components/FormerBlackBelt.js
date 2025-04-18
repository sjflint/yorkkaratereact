import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

const FormerBlackBelt = ({ blackBelt }) => {
  const gradingDates = Object.entries(blackBelt.danGradings);

  return (
    <>
      <Card className="bg-black">
        <div className="profileImg mx-auto">
          <Card.Img variant="top" src={blackBelt.profileImg} alt="" />
        </div>
        <Card.Body className="bg-light">
          <Card.Title className="text-center border-bottom border-warning pb-1">
            {blackBelt.firstName} {blackBelt.lastName}
          </Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              Grade: {blackBelt.danGrade}
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
            <ListGroupItem>
              Date Left:{" "}
              {new Date(blackBelt.dateLeft).toLocaleDateString("en-GB")}
            </ListGroupItem>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default FormerBlackBelt;
