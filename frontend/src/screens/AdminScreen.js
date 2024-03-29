import { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import membersImg from "../img/members.png";
import eventsImg from "../img/events.png";
import financialImg from "../img/financial.png";
import emailImg from "../img/email.png";
import timetableImg from "../img/timetable.png";
import productsImg from "../img/products.png";
import articlesImg from "../img/articles.png";
import ordersImg from "../img/orders.png";
import syllabusImg from "../img/syllabus.png";
import lessonplanImg from "../img/lessonplan.png";
import gradingImg from "../img/grading.png";
import registerImg from "../img/register.png";
import squadImg from "../img/medal-logo.jpg";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";
import { listEnquiries } from "../actions/enquiryActions";
import { listOrders } from "../actions/orderActions";
import { listProducts } from "../actions/productActions";
import { LIST_MEMBERS_RESET } from "../constants/memberConstants";
import { logout } from "../actions/memberActions";
import { listFinancials } from "../actions/financialActions";

const AdminScreen = ({ history }) => {
  const [zeroStock, setZeroStock] = useState(false);

  const dispatch = useDispatch();
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const enquiryList = useSelector((state) => state.enquiryList);
  const { enquiries } = enquiryList;

  const orderList = useSelector((state) => state.orderList);
  const { orders } = orderList;

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

  useEffect(() => {
    if (memberInfo && memberInfo.lastLogin) {
      const today = new Date();
      const sevenDays = today.setDate(today.getDate() - 7);
      const lastLogin = new Date(memberInfo.lastLogin).getTime();

      if (lastLogin <= sevenDays) {
        console.log("logging out");
        dispatch(logout());
      }
    }
    if (!memberInfo) {
      console.log("no member details");
      history.push(`/login?redirect=admin`);
    } else if (
      memberInfo.isAdmin ||
      memberInfo.isShopAdmin ||
      memberInfo.isInstructor ||
      memberInfo.isAuthor
    ) {
      console.log("authorised as admin");
    } else {
      history.push("/profile");
    }

    dispatch(listEnquiries());
    dispatch(listOrders());
    dispatch(listProducts("all"));
    dispatch(listFinancials());
  }, [history, memberInfo, member, dispatch]);

  let openOrders = [];
  if (orders) {
    orders.forEach((order) => {
      if (order.isPaid === "true" && !order.isDelivered) {
        openOrders.push(order);
      }
    });
  }

  if (products && zeroStock === false) {
    products.map((product) => {
      for (const key in product.countInStock) {
        if (product.countInStock[key] === 0) {
          setZeroStock(true);
        }
      }
    });
  }

  let beltsToOrder = 0;
  if (financials && financials.beltsToOrder) {
    Object.values(financials.beltsToOrder).forEach((val) => {
      if (val !== "Fully Stocked") {
        beltsToOrder = beltsToOrder + val;
      }
    });
  }

  return (
    <div className="mt-3">
      <Meta title="York Karate | Admin" />
      <Container fluid="md">
        <h3 className="text-center border-bottom border-warning pb-1">
          Administration Panel
        </h3>

        {memberInfo && (
          <>
            <p className="my-3">
              Hello {member && memberInfo.firstName}. What do you need to do
              today?
            </p>

            {memberInfo.isAdmin && (
              <>
                <h5 className="text-white mb-2 border-bottom border-warning">
                  Admin
                </h5>

                <Row className="mb-3 no-gutters max-width-700">
                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/admin/listMembers">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={membersImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Members
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/admin/editevents">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={eventsImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Events
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/admin/financialsummary">
                      <Card>
                        {financials &&
                          financials.subscriptionErrors.length > 0 && (
                            <div className="notification d-flex align-items-center justify-content-center">
                              !
                            </div>
                          )}
                        <Card.Img
                          variant="top"
                          src={financialImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Financial
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/admin/emailmembers">
                      <Card className="notification-container">
                        {enquiries && enquiries.length > 0 && (
                          <div className="notification d-flex align-items-center justify-content-center">
                            {enquiries.length}
                          </div>
                        )}
                        <Card.Img
                          variant="top"
                          src={emailImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Contact
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/admin/editclasses">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={timetableImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Timetable
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link
                      to="/admin/squad"
                      onClick={() => dispatch({ type: LIST_MEMBERS_RESET })}
                    >
                      <Card>
                        <Card.Img
                          variant="top"
                          src={squadImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">Squad</Card.Footer>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </>
            )}
            {memberInfo.isShopAdmin && (
              <>
                <h5 className="text-white mb-2 border-bottom border-warning">
                  Shop Admin
                </h5>
                <Row className="mb-3 no-gutters max-width-700">
                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/shopadmin/editproducts">
                      <Card className="notification-container">
                        {/* Notifications for products out of stock */}
                        {zeroStock === true && (
                          <div className="notification d-flex align-items-center justify-content-center">
                            !
                          </div>
                        )}
                        <Card.Img
                          variant="top"
                          src={productsImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Products
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/shopadmin/editorders">
                      <Card>
                        {/* Notifications for orders to be processed */}
                        {orders && openOrders.length > 0 && (
                          <div className="notification d-flex align-items-center justify-content-center">
                            {openOrders.length}
                          </div>
                        )}
                        <Card.Img
                          variant="top"
                          src={ordersImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Orders
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2"></Col>
                  <Col xs={6} sm={3} md={3} className="mb-2"></Col>
                </Row>
              </>
            )}

            {memberInfo.isAuthor && (
              <>
                <h5 className="text-white mb-2 border-bottom border-warning">
                  Author
                </h5>
                <Row className="mb-3 no-gutters max-width-700">
                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/author/editarticles">
                      <Card>
                        {/* Notification for events that have passed??? */}
                        <Card.Img
                          variant="top"
                          src={articlesImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Articles
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>
                  <Col xs={6} sm={3} md={3} className="mb-2"></Col>
                  <Col xs={6} sm={3} md={3} className="mb-2"></Col>
                  <Col xs={6} sm={3} md={3} className="mb-2"></Col>
                </Row>
              </>
            )}

            {memberInfo.isInstructor && (
              <>
                <h5 className="text-white mb-2 border-bottom border-warning">
                  Instructor
                </h5>
                <Row className="mb-3 no-gutters max-width-700">
                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/instructor/editsyllabus">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={syllabusImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Syllabus
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/instructor/editlessonplans">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={lessonplanImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Lesson Plans
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/instructor/editgradings">
                      <Card>
                        {beltsToOrder > 0 && (
                          <div className="notification d-flex align-items-center justify-content-center">
                            !
                          </div>
                        )}
                        <Card.Img
                          variant="top"
                          src={gradingImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Gradings
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>

                  <Col xs={6} sm={3} md={3} className="mb-2">
                    <Link to="/instructor/attendance">
                      <Card>
                        <Card.Img
                          variant="top"
                          src={registerImg}
                          className="p-3"
                        />
                        <Card.Footer className="text-center">
                          Attendance
                        </Card.Footer>
                      </Card>
                    </Link>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminScreen;
