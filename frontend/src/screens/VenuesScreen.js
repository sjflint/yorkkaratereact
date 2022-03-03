import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import archBishopHolgate from "../img/archbishopholgateschool.jpg";
import josephRowntreeSchool from "../img/josephrowntreeschool.jpg";
import stChadsHall from "../img/st.chadshall.jpg";
import strensallVillageHall from "../img/strensallvillagehall.jpg";

const VenuesScreen = () => {
  return (
    <Container className="text-center">
      <h3 className="text-center border-bottom border-warning">Venues</h3>
      <Row>
        <Col md={6} className="d-flex">
          <Card className="mb-2">
            <Card.Img
              variant="top"
              src={stChadsHall}
              className="bg-primary p-1"
            />
            <Card.Body>
              <Card.Title>Monday</Card.Title>
              <Card.Text>
                St Chads Church Hall Campleshon Rd, York YO23 1PE
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex">
          <Card className="mb-2">
            <Card.Img
              variant="top"
              src={josephRowntreeSchool}
              className="bg-primary p-1"
            />
            <Card.Body>
              <Card.Title>Tuesday / Wednesday / Friday</Card.Title>
              <Card.Text>
                Joseph Rowntree School Haxby Rd, York YO32 4BZ
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex">
          <Card className="mb-2">
            <Card.Img
              variant="top"
              src={archBishopHolgate}
              className="bg-primary p-1"
            />
            <Card.Body>
              <Card.Title>Thursday</Card.Title>
              <Card.Text>
                Archbishop Holgate School, Hull Rd, York YO10 5ZA
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex">
          <Card className="mb-2">
            <Card.Img
              variant="top"
              src={strensallVillageHall}
              className="bg-primary p-1"
            />
            <Card.Body>
              <Card.Title>Saturday</Card.Title>
              <Card.Text>
                Strensall Village Hall, Strensall, York YO32 5XW
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Link to="/timetable" className="btn btn-block btn-default">
        View full timetable listings
      </Link>
    </Container>
  );
};

export default VenuesScreen;
