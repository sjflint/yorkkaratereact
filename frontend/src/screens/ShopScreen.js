import React, { useEffect } from "react";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const ShopScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <Container>
      <div className="d-flex align-items-center justify-content-between border-bottom border-warning p-3 mb-2 bg-secondary">
        <h3 className="text-white">Club Shop</h3>
        <Link className="btn btn-warning my-3" to="/basket">
          <i className="fas fa-shopping-cart"></i> Checkout
        </Link>
      </div>

      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="warning" heading="Error loading products">
          {error}
        </Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col
              sm={12}
              md={6}
              lg={4}
              key={product._id}
              className="d-flex align-items-stretch"
            >
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ShopScreen;
