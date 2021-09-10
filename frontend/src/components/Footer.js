import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const d = new Date();
  const Year = d.getFullYear();

  return (
    <footer className="bg-primary mt-3">
      <Container>
        <Row>
          <Col className="text-center py-3">
            York Karate &copy; <span>{Year}</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
