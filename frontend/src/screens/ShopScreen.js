import { useEffect, useState } from "react";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import { Button, Col, Container, Row } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import logo from "../img/logo2021.png";
import secondaryLogo from "../img/logosubmark(transparent).png";
import ProductPaginate from "../components/ProductPaginate";
import { Link } from "react-router-dom";

const ShopScreen = ({ match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const [filterBy, setFilterBy] = useState("");

  useEffect(() => {
    dispatch(listProducts(pageNumber, filterBy));
  }, [dispatch, pageNumber, filterBy]);

  return (
    <div className="mt-3">
      <Container fluid="lg">
        <div className="d-flex align-items-center justify-content-between border-bottom border-warning mb-2 pb-2">
          <h3 className="mb-0">Shop</h3>
          <Link to="/basket">
            <Button variant="default">
              <i className="fas fa-shopping-cart"></i> Checkout
            </Button>
          </Link>
        </div>
        <Row className="mx-1 text-center align-items-center bg-primary">
          <Col>
            <img src={logo} alt="logo" className="max-width-200" />
          </Col>
          <Col>
            <h5 className="text-center text-warning">
              Bespoke training items available using the club logo
            </h5>
          </Col>

          <Col>
            <img
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
              className="fluid max-width-100"
              alt="paypal-logo"
            />
          </Col>
        </Row>
        <Row className="bg-secondary p-2 text-center g-0">
          <Col xs={12} sm={3}>
            <Button
              variant="outline-dark"
              onClick={() => setFilterBy("uniform/gi")}
              className="w-100 rounded-0"
            >
              Suits
            </Button>
          </Col>

          <Col xs={12} sm={3}>
            <Button
              variant="outline-dark"
              onClick={() => setFilterBy("equipment/protection")}
              className="w-100 rounded-0"
            >
              Equipment
            </Button>
          </Col>
          <Col xs={12} sm={3}>
            <Button
              variant="outline-dark"
              onClick={() => setFilterBy("clothing")}
              className="w-100 rounded-0"
            >
              Clothing
            </Button>
          </Col>
          <Col xs={12} sm={3}>
            <Button
              variant="outline-dark"
              onClick={() => setFilterBy("")}
              className="w-100 rounded-0"
            >
              All
            </Button>
          </Col>
        </Row>

        {loading ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading products">
            {error}
          </Message>
        ) : (
          <>
            {!filterBy && (
              <Row className="align-items-center bg-primary mx-3 text-center p-2">
                <Col xs={12} sm={3} md={4}>
                  <img src={secondaryLogo} alt="" className="max-width-100" />
                </Col>
                <Col xs={12} sm={6} md={4} className="bg-light">
                  <h3 className="text-center">Featured Products</h3>
                  <ProductCarousel />
                </Col>
                <Col xs={12} sm={3} md={4}>
                  <img src={secondaryLogo} alt="" className="max-width-100" />
                </Col>
              </Row>
            )}
            {!filterBy ? (
              <>
                <h5 className="mt-4 border-bottom border-warning pb-1">
                  Browse all of our products
                </h5>

                <Row className="no-gutters">
                  {products.map((product) => (
                    <Col
                      xs={6}
                      sm={6}
                      md={4}
                      key={product._id}
                      className="d-flex align-items-stretch"
                    >
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ProductPaginate
                    pages={pages}
                    page={page}
                    className="d-flex justify-content-center"
                  />
                </div>
              </>
            ) : (
              <>
                <h5 className="mt-4 border-bottom border-warning pb-1 text-white">
                  Browse {filterBy}
                </h5>
                <Row className="no-gutters">
                  {products.map((product) => (
                    <Col
                      xs={6}
                      sm={6}
                      md={4}
                      key={product._id}
                      className="d-flex align-items-stretch"
                    >
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ShopScreen;
