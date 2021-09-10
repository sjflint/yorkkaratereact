import { Card, Col } from "react-bootstrap";
const BeltCard = ({ grade, beltColor }) => {
  return (
    <Col md={6} lg={4} className="mt-2">
      <Card className="h-100">
        <Card.Img
          variant="top"
          src={`/img/belt-${beltColor}.jpg`}
          className="rounded-0"
        />
        <Card.Body className="bg-light text-primary">
          <Card.Title>{beltColor}</Card.Title>
          <Card.Text>{grade}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BeltCard;
