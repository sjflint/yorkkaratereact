import { useState } from "react";
import {
  Form,
  Button,
  Col,
  Card,
  ListGroup,
  Row,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormSteps from "../components/FormSteps";
import { savePaymentMethod } from "../actions/basketActions";

const PaymentScreen = ({ history }) => {
  const basket = useSelector((state) => state.basket);
  const { basketItems } = basket;

  if (!basket) {
    history.push("/basket");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  return (
    <Container className="mt-3">
      <div className="border-bottom border-warning mb-2">
        <FormSteps step1 step2 />
        <h3 className="text-center">Select Payment Method</h3>
      </div>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label as="legend">Select Payment Method</Form.Label>
              <Form.Check
                type="radio"
                label="PayPal or Credit Card"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
              <Form.Check
                type="radio"
                label="Direct Debit"
                id="DirectDebit"
                name="paymentMethod"
                value="DirectDebit"
                checked={paymentMethod === "DirectDebit"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
            <Col md={6} className="mb-3">
              <Card>
                <ListGroup.Item variant="light">
                  <h5>
                    Subtotal <br /> (
                    {basketItems.reduce((acc, item) => acc + item.qty, 0)})
                    items
                  </h5>
                  £
                  {basketItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </ListGroup.Item>
              </Card>
            </Col>
          </Row>
        </Form.Group>

        <Button type="submit" variant="default" className="btn-block">
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default PaymentScreen;
