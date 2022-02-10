import { Col, Nav, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

const FormSteps = ({ step1, step2, step3 }) => {
  return (
    <Row className="mb-2">
      <Col className="d-flex justify-content-around align-items-center" xs={4}>
        {step1 ? (
          <Link to="/basket" className="text-decoration-none">
            <small>View Basket</small>
          </Link>
        ) : (
          <small disabled className="text-muted">
            View Basket
          </small>
        )}
        <i className="fas fa-walking fa-2x"></i>
        <i className="fas fa-arrow-right"></i>
      </Col>
      <Col className="d-flex justify-content-around align-items-center" xs={4}>
        {step2 ? (
          <Link to="/payment" className="text-decoration-none">
            <small>Payment Method</small>
          </Link>
        ) : (
          <small disabled className="text-muted">
            Payment Method
          </small>
        )}
        <div className="d-flex align-items-center">
          <i className="fas fa-walking fa-2x"></i>
          <i className="fas fa-arrow-right"></i>
        </div>
      </Col>
      <Col className="d-flex justify-content-around align-items-center" xs={4}>
        {step3 ? (
          <LinkContainer to="placeOrder">
            <Nav.Link>Review Order</Nav.Link>
          </LinkContainer>
        ) : (
          <small disabled className="text-muted">
            Review Order
          </small>
        )}
      </Col>
    </Row>
  );
};

export default FormSteps;
