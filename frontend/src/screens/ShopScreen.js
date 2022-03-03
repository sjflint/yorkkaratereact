import { useEffect, useState } from "react";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import { Button, Col, Container, Row } from "react-bootstrap";
import ProductCarousel from "../components/ProductCarousel";
import logo from "../img/logo2021(transparent-black).png";
import ProductPaginate from "../components/ProductPaginate";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";
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
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Container fluid="lg">
            <div className="d-flex align-items-center justify-content-between border-bottom border-warning mb-2">
              <h3>Shop</h3>
              <Link to="/basket">
                <Button variant="default">
                  <i className="fas fa-shopping-cart"></i> Checkout
                </Button>
              </Link>
            </div>
            <Row className="bg-primary p-2 text-center">
              <Col xs={12} sm={3}>
                <Button
                  variant="dark"
                  onClick={() => setFilterBy("uniform/gi")}
                  className="w-100"
                >
                  Karate Suits
                </Button>
              </Col>

              <Col xs={12} sm={3}>
                <Button
                  variant="dark"
                  onClick={() => setFilterBy("equipment/protection")}
                  className="w-100"
                >
                  Equipment
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  variant="dark"
                  onClick={() => setFilterBy("clothing")}
                  className="w-100"
                >
                  Clothing
                </Button>
              </Col>
              <Col xs={12} sm={3}>
                <Button
                  variant="dark"
                  onClick={() => setFilterBy("")}
                  className="w-100"
                >
                  All Products
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
                  <Row className="align-items-center bg-light p-4">
                    <Col xs={12} sm={6}>
                      <h3 className="text-center text-white">
                        Featured Products
                      </h3>
                      <ProductCarousel />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Row className="mx-1 text-center">
                        <Col sm={12} xs={6} className="p-2">
                          <img src={logo} alt="logo" className="fluid" />
                          <h5 className="text-center text-warning">
                            Bespoke training items available using the club logo
                          </h5>
                        </Col>
                        <Col sm={12} xs={6} className="p-2 mt-3">
                          <img
                            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                            className="fluid max-width-300"
                            alt="paypal-logo"
                          />
                        </Col>
                      </Row>
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
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ShopScreen;
