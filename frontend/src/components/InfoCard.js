import { Card, Button } from "react-bootstrap";

const InfoCard = ({ title, text, link, image }) => {
  return (
    <Card>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button variant="warning" className="btn-block">
          <a href={link} target="_blank" rel="noreferrer">
            Visit Site
          </a>
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default InfoCard;
