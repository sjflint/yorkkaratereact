import { useEffect } from "react";
import { Card, Container, Row, Button, CardGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import membersImg from "../img/members.png";
import eventsImg from "../img/events.png";
import financialImg from "../img/financial.png";
import emailImg from "../img/email.png";
import timetableImg from "../img/timetable.png";

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
    <Container>
      <h3 className="text-center border-bottom border-warning pb-1">
        Administration Panel
      </h3>
      <h5 className="my-3">
        Hello {memberInfo.firstName}. What do you need to do today?
      </h5>
      <Row>
        {memberInfo.isAdmin && (
          <>
            <CardGroup className="mb-3">
              <Card>
                <Card.Img variant="top" src={membersImg} className="p-5" />
                <Card.Body>
                  <Card.Title>Member Details</Card.Title>
                  <Card.Text>View all members and edit details</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <LinkContainer to="/admin/listMembers">
                    <Button variant="secondary" className="btn-block">
                      List Members
                    </Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>

              <Card>
                <Card.Img variant="top" src={eventsImg} className="p-5" />
                <Card.Body>
                  <Card.Title>Edit Events</Card.Title>
                  <Card.Text>Create and Edit event listings</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <LinkContainer to="/admin/editevents">
                    <Button variant="secondary" className="btn-block">
                      Edit Events
                    </Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>

              <Card>
                <Card.Img variant="top" src={financialImg} className="p-5" />
                <Card.Body>
                  <Card.Title>Financial Summary</Card.Title>
                  <Card.Text>
                    View a current financial summary of York Karate
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <LinkContainer to="/admin/financialsummary">
                    <Button variant="secondary" className="btn-block" disabled>
                      Financial
                    </Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>
            </CardGroup>
            <CardGroup>
              <Card>
                <Card.Img variant="top" src={emailImg} className="p-5" />
                <Card.Body>
                  <Card.Title>Contact Members</Card.Title>
                  <Card.Text>
                    Send emails or texts to individuals or groups
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <LinkContainer to="/admin/emailmembers">
                    <Button variant="secondary" className="btn-block" disabled>
                      Contact
                    </Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>

              <Card>
                <Card.Img variant="top" src={timetableImg} className="p-5" />
                <Card.Body>
                  <Card.Title>Timetable details</Card.Title>
                  <Card.Text>View class numbers or edit timetable</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <LinkContainer to="/admin/edittimetable">
                    <Button variant="secondary" className="btn-block" disabled>
                      Timetable
                    </Button>
                  </LinkContainer>
                </Card.Footer>
              </Card>
              <Card></Card>
            </CardGroup>
          </>
        )}
        <p>Other admin type things here</p>
      </Row>
    </Container>
  );
};

export default AdminScreen;
