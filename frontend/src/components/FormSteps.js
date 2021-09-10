import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const FormSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className="justify-content-center mb-4 text-white">
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/basket">
            <Nav.Link>View Basket</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="text-primary">
            View Basket
          </Nav.Link>
        )}
      </Nav.Item>
      <div className="d-flex align-items-center">
        <i className="fas fa-walking fa-2x"></i>
        <i className="fas fa-arrow-right"></i>
      </div>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/payment">
            <Nav.Link>Payment Method</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="text-primary">
            Payment Method
          </Nav.Link>
        )}
      </Nav.Item>
      <div className="d-flex align-items-center">
        <i className="fas fa-walking fa-2x"></i>
        <i className="fas fa-arrow-right"></i>
      </div>
      <Nav.Item>
        {step3 ? (
          <LinkContainer to="placeOrder">
            <Nav.Link>Review Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="text-primary">
            Review Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default FormSteps;
