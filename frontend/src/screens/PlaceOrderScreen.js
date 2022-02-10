import { useEffect } from "react";
import { Row, Col, ListGroup, Image, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormSteps from "../components/FormSteps";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const basket = useSelector((state) => state.basket);
  const memberInfo = useSelector((state) => state.memberLogin.memberInfo);

  const itemsPrice = basket.basketItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [dispatch, history, success, order]);

  const placeOrderHandler = () => {
    basket.basketItems.map(
      (item) => (item.product = item.product.split("?")[0])
    );

    dispatch(
      createOrder({
        orderItems: basket.basketItems,
        paymentMethod: basket.paymentMethod,
        totalPrice: itemsPrice,
      })
    );
  };

  return (
    <Container className="mb-3">
      <div className="border-bottom border-warning p-1 mb-2">
        <FormSteps step1 step2 step3 />
        <div className="d-flex align-items-center justify-content-between">
          <Link className="btn btn-default my-3 mr-2" to="/shop">
            <i className="fas fa-chevron-left"></i> Back to Shop
          </Link>
          <h3 className="text-center text-white">Review Order</h3>
          <button
            className="btn btn-default my-3 mr-2"
            disabled={basket.basketItems.length === 0}
            onClick={placeOrderHandler}
          >
            Proceed To Payment <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <Row>
        <Col md={8}>
          <ListGroup.Item>
            <h3>Order for {memberInfo.firstName}</h3>
            <strong>Email: </strong>
            {memberInfo.email}
          </ListGroup.Item>
          <ListGroup.Item>
            <h3>Order Items</h3>
            {basket.basketItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ListGroup>
                {basket.basketItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col md={4} className="bg-light p-1">
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={8}>
                        <Row>
                          <Col md={12} className="text-center">
                            <Link
                              to={`/products/${item.product}`}
                              className="text-decoration-none"
                            >
                              <small>{item.name}</small>
                              <small>{item.print && `(${item.print})`}</small>
                            </Link>
                          </Col>
                          <Col md={6} className="text-center">
                            <small>Qty: {item.qty}</small>
                          </Col>
                          <Col md={6} className="text-center">
                            <strong>Total: </strong> £{item.qty * item.price}
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
        <Col md={4}>
          <Card>
            <ListGroup.Item variant="light">
              <h3 className="text-center">Order Summary</h3>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Col>Items Total:</Col>
                  <Col>£{itemsPrice.toFixed(2)}</Col>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col>Payment Method:</Col>
                  <Col>{basket.paymentMethod}</Col>
                </ListGroup.Item>

                {error && <Message variant="danger">{error}</Message>}

                <button
                  type="button"
                  className="btn-block btn-default btn btn-sm"
                  disabled={basket.basketItems === 0}
                  onClick={placeOrderHandler}
                >
                  Proceed to Payment
                </button>
              </ListGroup>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;
