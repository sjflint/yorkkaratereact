import { useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
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
import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const AdminScreen = ({ history }) => {
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    }
    if (memberInfo && !memberInfo.isAdmin) {
      history.push("/");
    }
  }, [history, memberInfo, member]);

  return (
    <div className="mt-3">
      <Meta title="York Karate | Admin" />
      <Container fluid="md">
        <h3 className="text-center border-bottom border-warning pb-1">
          Administration Panel
        </h3>
        <h5 className="my-3">
          Hello {member.isAdmin && memberInfo.firstName}. What do you need to do
          today?
        </h5>

        {member.isAdmin && (
          <>
            <h5 className="text-white mb-2 border-bottom border-warning">
              Admin
            </h5>

            <Row className="mb-3 no-gutters max-width-700">
              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/admin/listMembers">
                  <Card>
                    <Card.Img variant="top" src={membersImg} className="p-3" />
                    <Card.Footer className="text-center">Members</Card.Footer>
                  </Card>
                </Link>
              </Col>

              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/admin/editevents">
                  <Card>
                    <Card.Img variant="top" src={eventsImg} className="p-3" />
                    <Card.Footer className="text-center">Events</Card.Footer>
                  </Card>
                </Link>
              </Col>

              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/admin/financialsummary">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={financialImg}
                      className="p-3"
                    />
                    <Card.Footer className="text-center">Financial</Card.Footer>
                  </Card>
                </Link>
              </Col>

              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/admin/emailmembers">
                  <Card>
                    <Card.Img variant="top" src={emailImg} className="p-3" />
                    <Card.Footer className="text-center">
                      Contact (Incomplete)
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
                      Classes / Timetable
                    </Card.Footer>
                  </Card>
                </Link>
              </Col>
            </Row>
          </>
        )}
        {member.isShopAdmin && (
          <>
            <h5 className="text-white mb-2 border-bottom border-warning">
              Shop Admin
            </h5>
            <Row className="mb-3 no-gutters max-width-700">
              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/shopadmin/editproducts">
                  <Card>
                    <Card.Img variant="top" src={productsImg} className="p-3" />
                    <Card.Footer className="text-center">Products</Card.Footer>
                  </Card>
                </Link>
              </Col>

              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/shopadmin/editorders">
                  <Card>
                    <Card.Img variant="top" src={ordersImg} className="p-3" />
                    <Card.Footer className="text-center">Orders</Card.Footer>
                  </Card>
                </Link>
              </Col>

              <Col xs={6} sm={3} md={3} className="mb-2"></Col>
              <Col xs={6} sm={3} md={3} className="mb-2"></Col>
            </Row>
          </>
        )}

        {member.isAuthor && (
          <>
            <h5 className="text-white mb-2 border-bottom border-warning">
              Author
            </h5>
            <Row className="mb-3 no-gutters max-width-700">
              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/author/editarticles">
                  <Card>
                    <Card.Img variant="top" src={articlesImg} className="p-3" />
                    <Card.Footer className="text-center">Articles</Card.Footer>
                  </Card>
                </Link>
              </Col>
              <Col xs={6} sm={3} md={3} className="mb-2"></Col>
              <Col xs={6} sm={3} md={3} className="mb-2"></Col>
              <Col xs={6} sm={3} md={3} className="mb-2"></Col>
            </Row>
          </>
        )}

        {member.isInstructor && (
          <>
            <h5 className="text-white mb-2 border-bottom border-warning">
              Instructor
            </h5>
            <Row className="mb-3 no-gutters max-width-700">
              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/instructor/editsyllabus">
                  <Card>
                    <Card.Img variant="top" src={syllabusImg} className="p-3" />
                    <Card.Footer className="text-center">Syllabus</Card.Footer>
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
                    <Card.Img variant="top" src={gradingImg} className="p-3" />
                    <Card.Footer className="text-center">Gradings</Card.Footer>
                  </Card>
                </Link>
              </Col>

              <Col xs={6} sm={3} md={3} className="mb-2">
                <Link to="/instructor/attendance">
                  <Card>
                    <Card.Img variant="top" src={registerImg} className="p-3" />
                    <Card.Footer className="text-center">
                      Attendance
                    </Card.Footer>
                  </Card>
                </Link>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default AdminScreen;
