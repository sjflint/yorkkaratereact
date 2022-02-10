import { Card } from "react-bootstrap";
const InfoCard = ({ title, text, link, image }) => {
  return (
    <Card>
      <Card.Img variant="top" src={image} className="bg-primary p-1" />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="d-block btn btn-default"
        >
          Visit Site
        </a>
      </Card.Footer>
    </Card>
  );
};

export default InfoCard;
