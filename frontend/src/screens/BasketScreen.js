import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToBasket, removeFromBasket } from "../actions/basketActions";

const BasketScreen = ({ match, location, history }) => {
  const productId = match.params.id;

  const qty = location.search
    ? Number(location.search.split("=")[2].split("&")[0])
    : 1;
  const size = location.search
    ? location.search.split("=")[1].split("&")[0]
    : null;
  const print = location.search ? location.search.split("=")[3] : "";

  const dispatch = useDispatch();

  const basket = useSelector((state) => state.basket);
  const { basketItems } = basket;

  useEffect(() => {
    if (match.params.id) {
      dispatch(addToBasket(productId, qty, size, print));
      history.push(`/basket`);
    }
  }, [dispatch, productId, qty, size, print, history, match.params.id]);

  const removeFromBasketHandler = (id) => {
    dispatch(removeFromBasket(id));
  };

  const checkoutHandler = () => {
    history.push("/login?redirect=payment");
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex align-items-center justify-content-between border-bottom border-warning mb-2">
        <Link className="btn btn-default my-3 mr-2 btn-sm" to="/shop">
          <i className="fas fa-chevron-left"></i> Back to Shop
        </Link>
        <h3 className="text-center">Club Shop</h3>
        <button
          className="btn btn-default my-3 mr-2 btn-sm"
          disabled={basketItems.length === 0}
          onClick={checkoutHandler}
        >
          Proceed To Checkout <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <Row>
        <Col sm={8}>
          {basketItems.length === 0 ? (
            <Message variant="primary" heading="Your basket is empty"></Message>
          ) : (
            <>
              {basketItems.map((item) => (
                <ListGroup.Item key={item.product + item.size + Math.random()}>
                  <Row className="align-items-center">
                    <Col md={2} className="bg-light p-1">
                      <Image src={item.image} alt={item.name} />
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/products/${item.product.split("?")[0]}`}
                        className="text-decoration-none d-flex flex-column"
                      >
                        <small>{item.name}</small>
                        <small>{item.size}</small>
                      </Link>
                    </Col>
                    <Col md={2}>£{item.price}</Col>
                    <Col md={3}>
                      {item.countInStock ? (
                        <Form.Control
                          as="select"
                          value={Number(item.qty)}
                          onChange={(e) =>
                            dispatch(
                              addToBasket(
                                item.product,
                                Number(e.target.value),
                                item.size
                              )
                            )
                          }
                        >
                          {[...Array(item.countInStock[item.size]).keys()].map(
                            (x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            )
                          )}
                        </Form.Control>
                      ) : (
                        <>
                          <small>Name:</small>
                          <br />
                          <small>{item.print}</small>
                        </>
                      )}
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeFromBasketHandler(item.product)}
                        className="btn-sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </>
          )}
        </Col>
        <Col sm={4}>
          <Card>
            <ListGroup.Item variant="light" className="text-light">
              <ListGroup.Item>
                <h5>
                  Subtotal (
                  {basketItems.reduce((acc, item) => acc + item.qty, 0)}) items
                </h5>
                £
                {basketItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item className="text-center">
                <button
                  className="btn-block btn btn-default btn-sm"
                  disabled={basketItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </ListGroup.Item>
            </ListGroup.Item>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BasketScreen;
