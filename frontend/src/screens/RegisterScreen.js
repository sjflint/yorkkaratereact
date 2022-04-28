import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import RegistrationForm from "../components/FormComponents/RegistrationForm";

const RegisterScreen = () => {
  return (
    <Container className="mt-3">
      <h1>Member Registration</h1>
      <RegistrationForm />
      <Row className="py-3">
        <Col>
          <Link to={"/login"}>Already a member?</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;
