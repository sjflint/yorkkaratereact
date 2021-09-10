import { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
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
    console.log(basket.basketItems);

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
      <div className="border-bottom border-warning p-1 pb-3 mb-2 bg-secondary">
        <FormSteps step1 step2 step3 />
        <div className="d-flex align-items-center justify-content-between">
          <Link className="btn btn-warning my-3 mr-2" to="/shop">
            <i className="fas fa-chevron-left"></i> Back to Shop
          </Link>
          <h3 className="text-center text-white">Review Order</h3>
          <Button
            className="btn btn-warning my-3 mr-2"
            disabled={basket.basketItems.length === 0}
            onClick={placeOrderHandler}
          >
            Proceed To Payment <i className="fas fa-chevron-right"></i>
          </Button>
        </div>
      </div>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Order for {memberInfo.firstName}</h2>
              <strong>Email: </strong>
              {memberInfo.email}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {basket.basketItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {basket.basketItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col md={4}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
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
                          <strong>Total: </strong> £{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Col>Items Total:</Col>
                  <Col>£{itemsPrice.toFixed(2)}</Col>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Col>Payment Method:</Col>
                  <Col>{basket.paymentMethod}</Col>
                </ListGroup.Item>
                <ListGroup.Item>
                  {error && <Message variant="danger">{error}</Message>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block btn-warning"
                    disabled={basket.basketItems === 0}
                    onClick={placeOrderHandler}
                  >
                    Proceed to Payment
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;
