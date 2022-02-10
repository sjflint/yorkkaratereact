import { useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from "../actions/productActions";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = ({ history, match }) => {
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [print, setPrint] = useState("");

  const dispatch = useDispatch();

  const displayProduct = useSelector((state) => state.displayProduct);
  const { loading, error, product } = displayProduct;

  useEffect(() => {
    dispatch(listProduct(match.params.id));
  }, [dispatch, match]);

  // add to cart handler
  const addToBasketHandler = () => {
    history.push(
      `/basket/${match.params.id}?size=${size}&qty=${qty}&print=${print}`
    );
  };

  // check for stock level
  let stock;
  if (product.countInStock) {
    stock = product.countInStock[size];
  }

  return (
    <Container>
      <div className="d-flex align-items-center justify-content-between border-bottom border-warning mb-2">
        <Link className="btn btn-default my-3 mr-2" to="/shop">
          <i className="fas fa-chevron-left"></i> Back to Shop
        </Link>
        <h3>Club Shop</h3>
        <Link className="btn btn-default my-3" to="/basket">
          <i className="fas fa-shopping-cart"></i> Checkout
        </Link>
      </div>
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="warning" heading="Product failed to load">
          {error}
        </Message>
      ) : (
        <>
          <Row className="align-items-center">
            <Col md={7} className="bg-light p-2">
              <Image src={product.image} alt={product.name} />
            </Col>
            <Col md={5}>
              <ListGroup variant="flush">
                <ListGroup.Item variant="secondary">
                  <h4>{product.name}</h4>
                </ListGroup.Item>
                <ListGroup.Item variant="secondary">
                  {product.price && `Price: £${product.price.toFixed(2)}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <p>{product.description}</p>
                </ListGroup.Item>

                {product.countInStock ? (
                  <ListGroup.Item variant="secondary">
                    <h5 className="py-2">Size</h5>
                    <Form.Control
                      as="select"
                      value={size}
                      onChange={(e) => {
                        setSize(e.target.value);
                        setQty(1);
                      }}
                    >
                      <option>Please select</option>
                      {Object.keys(product.countInStock).map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </Form.Control>
                  </ListGroup.Item>
                ) : (
                  product.sizes && (
                    <>
                      <ListGroup.Item variant="secondary">
                        <h5 className="py-2">Size</h5>
                        <Form.Control
                          as="select"
                          value={size}
                          onChange={(e) => {
                            setSize(e.target.value);
                          }}
                        >
                          <option>Please select</option>

                          {product.sizes.map((x) => (
                            <option key={x} value={x}>
                              {x}
                            </option>
                          ))}
                        </Form.Control>
                      </ListGroup.Item>
                      {size && (
                        <>
                          <ListGroupItem variant="secondary">
                            <h5 className="py-2">
                              Name to be printed on item (optional)
                            </h5>
                            <Form.Control
                              as="input"
                              value={print}
                              onChange={(e) => {
                                setPrint(e.target.value);
                              }}
                            ></Form.Control>
                          </ListGroupItem>
                          <ListGroupItem variant="secondary">
                            <button
                              className="btn-block btn btn-default"
                              type="button"
                              onClick={addToBasketHandler}
                            >
                              Add to Basket
                            </button>
                          </ListGroupItem>
                        </>
                      )}
                    </>
                  )
                )}

                {stock === 0 ? (
                  <ListGroup.Item variant="danger" className="text-center">
                    Out of Stock
                  </ListGroup.Item>
                ) : (
                  stock > 0 && (
                    <>
                      <ListGroup.Item variant="secondary">
                        <Row>
                          <Col>
                            <h5 className="py-2">Available Stock</h5>
                          </Col>
                          <Col>
                            <Form.Control
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(stock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroupItem variant="secondary">
                        <button
                          className="btn-block btn btn-default"
                          type="button"
                          onClick={addToBasketHandler}
                        >
                          Add to Basket
                        </button>
                      </ListGroupItem>
                    </>
                  )
                )}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default ProductScreen;
