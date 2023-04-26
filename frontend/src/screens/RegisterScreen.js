import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import RegistrationForm from "../components/FormComponents/RegistrationForm";

const RegisterScreen = () => {
  return (
    <Container className="mt-3">
      <h1 className="text-center">Member Registration</h1>
      <RegistrationForm />
    </Container>
  );
};

export default RegisterScreen;
