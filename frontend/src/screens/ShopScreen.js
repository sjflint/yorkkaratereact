import { useEffect, useState } from "react";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import logo from "../img/logo2021.png";
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
        <Container>
          <Row className="text-center align-items-center bg-primary">
            <Col xs={6} className="my-3">
              <img src={logo} alt="logo" className="max-width-200" />
            </Col>
            <Col xs={6}>
              <img
                src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                className="fluid max-width-100"
                alt="paypal-logo"
              />
            </Col>
            <Col sm={12}>
              <h5 className="text-center text-warning">
                Bespoke training items available using the club logo
              </h5>
            </Col>
          </Row>
        </Container>

        <Container className="bg-dark">
          <Navbar
            expand="sm"
            collapseOnSelect
            bg="dark"
            variant="dark"
            className="py-1 mx-0"
          >
            <Navbar.Toggle aria-controls="shop-nav" />
            <Navbar.Collapse id="shop-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={() => setFilterBy("uniform/gi")} href="#">
                  Suits
                </Nav.Link>
                <Nav.Link
                  onClick={() => setFilterBy("equipment/protection")}
                  href="#"
                >
                  Equipment
                </Nav.Link>
                <Nav.Link onClick={() => setFilterBy("clothing")} href="#">
                  Clothing
                </Nav.Link>
                <Nav.Link onClick={() => setFilterBy("")} href="#">
                  All
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>

        {loading ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading products">
            {error}
          </Message>
        ) : (
          <>
            {!filterBy && (
              <Container>
                <Row className="align-items-center bg-primary text-center p-2">
                  <Col xs={12} sm={2} md={2}></Col>
                  <Col xs={12} sm={8} md={8} className="bg-light">
                    <h3 className="text-center">Featured Products</h3>
                    <ProductCarousel />
                  </Col>
                  <Col xs={12} sm={2} md={2}></Col>
                </Row>
              </Container>
            )}
            {!filterBy ? (
              <>
                <h5 className="mt-4 border-bottom border-warning pb-1">
                  Browse all of our products
                </h5>

                <Row className="no-gutters">
                  {products.map((product) => (
                    <Col
                      xs={12}
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
