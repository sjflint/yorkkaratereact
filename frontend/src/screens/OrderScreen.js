import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Container,
  Button,
  ListGroupItem,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
  fulfilOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_FULFIL_RESET,
} from "../constants/orderConstants";
import { BASKET_CLEAR } from "../constants/BasketConstants";
import directDebitImg from "../../src/img/directdebit.jpg";
import { createPayment } from "../actions/directDebitActions";
import { CREATE_DD_PAYMENT_RESET } from "../constants/directDebitConstants";

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

  const orderFulfil = useSelector((state) => state.orderFulfil);
  const { loading: loadingFulfil, success: successFulfil } = orderFulfil;

  const createDDPayment = useSelector((state) => state.createDDPayment);
  const {
    loading: loadingDDPayment,
    success: successDDPayment,
    data,
  } = createDDPayment;

  const successPaymentHandler = useCallback(
    async (paymentResult) => {
      await dispatch(payOrder(orderId, paymentResult));
      if (paymentResult.status === "COMPLETED") {
        localStorage.removeItem("basketItems");
        dispatch({ type: BASKET_CLEAR });
      }
    },
    [dispatch, orderId]
  );

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

    if (successDDPayment) {
      const paymentResult = {
        _id: order._id,
        status: "COMPLETED",
        update_time: Date.now(),
        payer: {
          email_address: memberInfo.email,
        },
        paymentId: data.paymentId,
      };
      successPaymentHandler(paymentResult);
    }

    if (
      !order ||
      order._id !== orderId ||
      successPay ||
      successDeliver ||
      successFulfil ||
      successDDPayment
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch({ type: ORDER_FULFIL_RESET });
      dispatch({ type: CREATE_DD_PAYMENT_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (order.isPaid === "false") {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    order,
    orderId,
    successPay,
    successDeliver,
    successFulfil,
    successDDPayment,
    memberInfo.email,
  ]);

  const payDirectDebitHandler = () => {
    const paymentDetails = {
      _id: memberInfo._id,
      amount: Number(order.totalPrice) * 100,
      description: "Payment to York Karate Shop",
    };

    dispatch(createPayment(paymentDetails));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  const fulfilHandler = () => {
    dispatch(fulfilOrder(order));
  };

  return loading ? (
    <Loader variant="warning" />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <Container>
      <h5 className="border-bottom border-warning">
        Order Number: {order._id}
      </h5>

      <Row>
        <Col md={7}>
          <ListGroup.Item variant="light">
            <h4>Order Items</h4>
            {order.orderItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ListGroup variant="flush" className="text-light">
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col md={4} className="bg-light p-1">
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={8}>
                        <Row>
                          <Col md={12} className="text-center">
                            <Link to={`/products/${item.product}`}>
                              {item.name} <br />
                              {item.print && `(${item.print})`}
                            </Link>
                          </Col>
                          <Col md={6} className="text-center">
                            Qty <br />
                            {item.qty}
                          </Col>
                          <Col md={6} className="text-center">
                            <strong>Total: </strong> £
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </Col>
        <Col md={5}>
          <ListGroup className="text-light">
            <ListGroup.Item>
              <p className="mb-0">Order Total:</p>
              <p>£{order.totalPrice.toFixed(2)}</p>
            </ListGroup.Item>

            {order.isPaid === "false" && (
              <>
                <ListGroup.Item className="text-center">
                  <p className="mb-0">Payment Method:</p>
                  <p> {order.paymentMethod}</p>
                  <Link to="/payment">
                    <Button variant="default" className="btn-sm">
                      Switch Payment Method
                    </Button>
                  </Link>
                </ListGroup.Item>
              </>
            )}
          </ListGroup>

          {order.isPaid === "false" ? (
            order.paymentMethod === "PayPal" ? (
              <ListGroup.Item variant="light">
                {loadingPay && <Loader variant="warning" />}
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
            ) : (
              <div className="d-flex flex-column align-items-center">
                <img
                  src={directDebitImg}
                  alt="directdebitlogo"
                  className="w-50 m-2"
                />
                <Button variant="default" onClick={payDirectDebitHandler}>
                  Pay Now
                </Button>
              </div>
            )
          ) : order.isPaid === "pending" ? (
            <ListGroupItem>
              Payment Status:
              <br />
              <h5 className="text-warning">Payment Pending</h5>
              <small>
                Direct Debit payments usually clear within 5 working days.
                You're order will be fulfilled after the payment has cleared.
              </small>
            </ListGroupItem>
          ) : (
            <ListGroup.Item>
              Payment Status:
              <br />
              <h5 className="text-success">Payment Success</h5>
            </ListGroup.Item>
          )}
        </Col>
      </Row>
      {order.isPaid === "false" ? (
        <p className="text-danger text-center">Please complete payment</p>
      ) : loadingDDPayment ? (
        <Loader variant="default" />
      ) : !order.isDelivered ? (
        <Message className="text-center" variant="success">
          <h5 className="text-dark">Thank you for your order</h5>
        </Message>
      ) : null}
      <ListGroup className="mt-2">
        {order.isPaid === "true" &&
          (!order.isDelivered ? (
            <ListGroup.Item variant="light">
              <p className="text-dark">
                Your order is being processed. Check your order status anytime
                in your profile:
              </p>
              <Link to="/profile?key=second">
                <button className="btn-sm btn btn-default">
                  View Order Status
                </button>
              </Link>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item className="text-center" variant="success">
              <h5>
                Collection Status: Ready to be collected at your next class
              </h5>
            </ListGroup.Item>
          ))}

        {loadingDeliver || (loadingFulfil && <Loader variant="warning" />)}
        {memberInfo.isShopAdmin &&
        order.isPaid === "true" &&
        !order.isDelivered ? (
          <ListGroup.Item>
            <p>SHOP ADMIN:</p>
            <button
              className="btn-sm d-inline btn-default btn"
              onClick={deliverHandler}
            >
              Mark As Ready For Collection
            </button>
          </ListGroup.Item>
        ) : memberInfo.isShopAdmin &&
          order.isPaid &&
          order.isDelivered &&
          !order.isComplete ? (
          <ListGroup.Item>
            <p>SHOP ADMIN:</p>
            <button
              className="btn-sm d-inline btn-default btn"
              onClick={fulfilHandler}
            >
              Mark As Fulfilled
            </button>
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </Container>
  );
};

export default OrderScreen;
