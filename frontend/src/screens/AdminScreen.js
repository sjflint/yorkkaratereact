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
import { Link } from "react-router-dom";

const AdminScreen = ({ history }) => {
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    } else if (!memberInfo.isAdmin) {
      history.push("/");
    }
  }, [history, memberInfo]);

  return (
    <Container fluid="md">
      <h3 className="text-center border-bottom border-warning pb-1">
        Administration Panel
      </h3>
      <h5 className="my-3">
        Hello {memberInfo.firstName}. What do you need to do today?
      </h5>

      {memberInfo.isAdmin && (
        <>
          <h5 className="text-white mb-2 border-bottom border-warning">
            Admin
          </h5>

          <Row className="mb-3 no-gutters">
            <Col xs={6} sm={3} className="mb-2">
              <Link to="/admin/listMembers">
                <Card>
                  <Card.Img variant="top" src={membersImg} className="p-3" />
                  <Card.Footer className="text-center">Members</Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/admin/editevents">
                <Card>
                  <Card.Img variant="top" src={eventsImg} className="p-3" />
                  <Card.Footer className="text-center">Events</Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/admin/financialsummary">
                <Card>
                  <Card.Img variant="top" src={financialImg} className="p-3" />
                  <Card.Footer className="text-center">
                    Financial (Incomplete)
                  </Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/admin/emailmembers">
                <Card>
                  <Card.Img variant="top" src={emailImg} className="p-3" />
                  <Card.Footer className="text-center">
                    Contact (Incomplete)
                  </Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/admin/editclasses">
                <Card>
                  <Card.Img variant="top" src={timetableImg} className="p-3" />
                  <Card.Footer className="text-center">
                    Classes / Timetable
                  </Card.Footer>
                </Card>
              </Link>
            </Col>
          </Row>

          <h5 className="text-white mb-2 border-bottom border-warning">
            Shop Admin
          </h5>
          <Row className="mb-3 no-gutters">
            <Col xs={6} sm={3} className="mb-2">
              <Link to="/shopadmin/editproducts">
                <Card>
                  <Card.Img variant="top" src={productsImg} className="p-3" />
                  <Card.Footer className="text-center">Products</Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/shopadmin/editorders">
                <Card>
                  <Card.Img variant="top" src={ordersImg} className="p-3" />
                  <Card.Footer className="text-center">Orders</Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2"></Col>
            <Col xs={6} sm={3} className="mb-2"></Col>
          </Row>

          <h5 className="text-white mb-2 border-bottom border-warning">
            Author
          </h5>
          <Row className="mb-3 no-gutters">
            <Col xs={6} sm={3} className="mb-2">
              <Link to="/author/editarticles">
                <Card>
                  <Card.Img variant="top" src={articlesImg} className="p-3" />
                  <Card.Footer className="text-center">Articles</Card.Footer>
                </Card>
              </Link>
            </Col>
            <Col xs={6} sm={3} className="mb-2"></Col>
            <Col xs={6} sm={3} className="mb-2"></Col>
            <Col xs={6} sm={3} className="mb-2"></Col>
          </Row>

          <h5 className="text-white mb-2 border-bottom border-warning">
            Instructor
          </h5>
          <Row className="mb-3 no-gutters">
            <Col xs={6} sm={3} className="mb-2">
              <Link to="/instructor/editsyllabus">
                <Card>
                  <Card.Img variant="top" src={syllabusImg} className="p-3" />
                  <Card.Footer className="text-center">
                    Syllabus (Incomplete)
                  </Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/instructor/editlessonplans">
                <Card>
                  <Card.Img variant="top" src={lessonplanImg} className="p-3" />
                  <Card.Footer className="text-center">
                    Lesson Plans (Incomplete)
                  </Card.Footer>
                </Card>
              </Link>
            </Col>

            <Col xs={6} sm={3} className="mb-2">
              <Link to="/instructor/editgradings">
                <Card>
                  <Card.Img variant="top" src={gradingImg} className="p-3" />
                  <Card.Footer className="text-center">
                    Gradings (Incomplete)
                  </Card.Footer>
                </Card>
              </Link>
            </Col>
            <Col xs={6} sm={3} className="mb-2"></Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default AdminScreen;
