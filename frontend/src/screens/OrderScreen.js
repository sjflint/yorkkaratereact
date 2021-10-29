import { useEffect, useState } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Row, Col, ListGroup, Image, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import { BASKET_CLEAR } from "../constants/BasketConstants";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

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

    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = async (paymentResult) => {
    await dispatch(payOrder(orderId, paymentResult));
    if (paymentResult.status === "COMPLETED") {
      localStorage.removeItem("basketItems");
      dispatch({ type: BASKET_CLEAR });
    }
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
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
      {!order.isPaid ? (
        <ListGroup.Item variant="danger" className="text-center">
          <h5 className="text-dark">Payment Status: Not Paid</h5>
        </ListGroup.Item>
      ) : (
        <ListGroup.Item className="text-center">
          <h5>Payment Status: Paid</h5>
        </ListGroup.Item>
      )}
      {order.isPaid &&
        (!order.isDelivered ? (
          <ListGroup.Item variant="danger" className="text-center">
            <h5 className="text-dark">
              Collection Status: Not ready for collection
            </h5>
          </ListGroup.Item>
        ) : (
          <ListGroup.Item className="text-center" variant="success">
            <h5>Collection Status: Ready to be collected at your next class</h5>
          </ListGroup.Item>
        ))}

      {loadingDeliver && <Loader variant="warning" />}
      {memberInfo.isShopAdmin && order.isPaid && !order.isDelivered && (
        <ListGroup.Item>
          <button
            type="button"
            className="btn btn-block btn-default"
            onClick={deliverHandler}
          >
            Mark As Ready For Collection
          </button>
        </ListGroup.Item>
      )}
    </Container>
  );
};

export default OrderScreen;
