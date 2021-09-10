import { useEffect, useState } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Row, Col, ListGroup, Image, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import { BASKET_CLEAR } from "../constants/BasketConstants";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || order._id !== orderId || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay]);

  const successPaymentHandler = async (paymentResult) => {
    await dispatch(payOrder(orderId, paymentResult));
    if (paymentResult.status === "COMPLETED") {
      localStorage.removeItem("basketItems");
      dispatch({ type: BASKET_CLEAR });
    }
  };

  return loading ? (
    <Loader variant="warning" />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Container>
      <h3 className="border-bottom border-warning">
        Order Number: {order._id}
      </h3>
      {!order.isPaid ? (
        <ListGroup.Item variant="danger" className="mb-2">
          <h5 className="text-dark">Payment Status: Not Paid</h5>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item variant="success" className="mb-2">
          <h5 className="text-dark">Payment Status: Paid</h5>
        </ListGroup.Item>
      )}
      <Row>
        <Col sm={8}>
          <ListGroup.Item>
            <h4>Order Items</h4>
            {order.orderItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={2} className="text-center">
                        <Link to={`/products/${item.product}`}>
                          {item.name} <br />
                          {item.print && `(${item.print})`}
                        </Link>
                      </Col>
                      <Col md={2} className="text-center">
                        Qty <br />
                        {item.qty}
                      </Col>
                      <Col md={4} className="text-center">
                        <strong>Total: </strong> £
                        {(item.qty * item.price).toFixed(2)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </Col>
        <Col sm={4}>
          <ListGroup.Item>
            <Row>
              <Col>Order Total:</Col>
              <Col>£{order.totalPrice.toFixed(2)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col>Payment Method:</Col>
              <Col> {order.paymentMethod}</Col>
            </Row>
          </ListGroup.Item>
        </Col>
      </Row>
      {!order.isPaid && (
        <ListGroup.Item>
          {loadingPay && <Loader />}
          {!sdkReady ? (
            <Loader />
          ) : (
            <div className="text-center">
              <PayPalButton
                amount={order.totalPrice.toFixed(2)}
                onSuccess={successPaymentHandler}
              />
            </div>
          )}
        </ListGroup.Item>
      )}
    </Container>
  );
};

export default OrderScreen;
