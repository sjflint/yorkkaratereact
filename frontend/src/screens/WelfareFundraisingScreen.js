import React from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import colinIMG from "../img/colin-profile.jpg";
import annaIMG from "../img/Anna-profile.jpg";
import kerryIMG from "../img/kerry-profile.jpg";
import candleLightersLogoIMG from "../img/candlelighterslogo.png";
import riskAssessmentPDF from "../documents/riskAssessment.pdf";
import athletesCodeOfConductPDF from "../documents/athletesCodeOfConduct.pdf";
import childProtectionPDF from "../documents/childProtection.pdf";
import complaintsProcedurePDF from "../documents/complaintsProcedure.pdf";
import disciplinaryRulesPDF from "../documents/disciplinaryRules.pdf";
import instructorCodeOfConductPDF from "../documents/instructorCodeOfConduct.pdf";
import organisationAndStructurePDF from "../documents/organisationAndStructure.pdf";
import parentsCodeOfConductPDF from "../documents/parentsCodeOfConduct.pdf";
import reportingConcernsPDF from "../documents/reportingConcerns.pdf";
import termsAndConditionsPDF from "../documents/termsAndConditions.pdf";

const WelfareFundraisingScreen = () => {
  return (
    <Container>
      <h3 className="text-center border-bottom border-warning pb-1">
        Welfare and Fundraising
      </h3>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header className="bg-secondary text-white text-center">
              <h5>The Committee</h5>
            </Card.Header>
            <Card.Img variant="top" src={colinIMG} alt="" />
            <Card.Body>
              <Card.Title className="text-center text-warning py-1">
                Chairperson
              </Card.Title>
              <Card.Text className="text-center">
                Colin Roe
                <a className="d-block" href="mailto:colinroe1@icloud.com">
                  colinroe1@icloud.com
                </a>
                <a href="tel:07900 802 635">07900 802 635</a>
              </Card.Text>
            </Card.Body>
            <Card.Img variant="top" src={annaIMG} alt="" />
            <Card.Body>
              <Card.Title className="text-center text-warning py-1">
                Welfare Officer
              </Card.Title>
              <Card.Text className="text-center">
                Anna Holmes-Ellerker
                <a className="d-block" href="mailto:amhe1979@icloud.com">
                  amhe1979@icloud.com
                </a>
                <a href="tel:07900 802 635">07972 164 204</a>
              </Card.Text>
            </Card.Body>
            <Card.Img variant="top" src={kerryIMG} alt="" />
            <Card.Body>
              <Card.Title className="text-center text-warning py-1">
                Secretary
              </Card.Title>
              <Card.Text className="text-center">Kerry Miller</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h4 className="text-warning pb-1">The Welfare Committee</h4>
          <p>
            The welfare committee's role within the club is to uphold the club's
            policies and procedures, including the code of conduct and the child
            protection policy. The welfare committee is also assigned with
            raising funds for the club and the York Karate squad.
          </p>
          <p className="lead text-warning pt-4 pb-1">External Contacts</p>
          <p>
            York Karate is associated with the English Karate Federation. As
            such, welfare concerns can be raised directly with the English
            Karate Federation: <br />
            <a
              href="mailto:cpo@englishkaratefederation.com"
              target="_blank"
              rel="noreferrer"
            >
              Child Protection Officer Steve Coupland
            </a>
          </p>
          <p>
            If you are a child and you are looking for help and support, but
            don't know who to turn to, please call the Childline. They are
            qualified professionals who can listen to whatever your problem is
            and offer help and support. <br />
            <a
              href="http://www.childline.org.uk"
              target="_blank"
              rel="noreferrer"
            >
              www.childline.org.uk
            </a>
          </p>
          <p className="lead text-warning">Complaint Procedure</p>
          <p>
            Should you be unhappy and wish to complain about any aspect of York
            Karate, you can make a formal complaint that will be investigated by
            the club. Please click below for our complaints procedure: <br />
            <a href={complaintsProcedurePDF} target="_blank" rel="noreferrer">
              York Karate Complaints Procedure
            </a>
          </p>
          <p className="lead text-warning">Fundraising</p>
          <p>
            The committee will also be organising regular events to raise money
            for the club members. This money could be spent on such things as:
          </p>
          <ul className="ml-5">
            <li>
              Supporting our athletes in competitions (covering
              transportation/airfare/accommodation costs)
            </li>
            <li>
              Supporting our athletes with additional training costs (attending
              seminars/1 - 1 sessions/training in Japan)
            </li>
            <li>Provide funding for members from disadvantaged backgrounds</li>
            <li>running social activities</li>
            <li>Supporting our designated charity Candlelighters</li>
          </ul>
          <p>
            Please look out for fundraising events published on this website and
            on our social media. The committee is always looking for volunteers
            to assist with the organisation and planning of events. Please
            contact them if you would like to help.
          </p>
          <p className="lead text-warning">Charity - Candlelighters</p>
          <p>
            Our designated charity is Candlelighters. An excellent, local
            charity that provides help and assistance to children with cancer,
            and crucial support to their families. The charity has a direct
            connection to the club as they have been crucial in helping one of
            our members. For more information on the excellent work they do,
            please visit their website:
          </p>
          <a
            href="https://www.candlelighters.org.uk/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="text-center">
              <img src={candleLightersLogoIMG} alt="" />
            </div>
          </a>
        </Col>
      </Row>
      <Card className="mb-3 text-center">
        <Card.Header className="bg-warning text-white">
          Club Policies
        </Card.Header>
        <ListGroup>
          <ListGroup.Item>
            <a href={riskAssessmentPDF} target="_blank" rel="noreferrer">
              Risk Assessment
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={complaintsProcedurePDF} target="_blank" rel="noreferrer">
              Complaints Procedure
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={reportingConcernsPDF} target="_blank" rel="noreferrer">
              Reporting Concerns
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a
              href={organisationAndStructurePDF}
              target="_blank"
              rel="noreferrer"
            >
              Structure & Organisation
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={childProtectionPDF} target="_blank" rel="noreferrer">
              Child Protection
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={disciplinaryRulesPDF} target="_blank" rel="noreferrer">
              Disciplinary Rules
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a
              href={instructorCodeOfConductPDF}
              target="_blank"
              rel="noreferrer"
            >
              Instructor Code of Conduct
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={athletesCodeOfConductPDF} target="_blank" rel="noreferrer">
              Athletes Code of Conduct
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={parentsCodeOfConductPDF} target="_blank" rel="noreferrer">
              Parents Code of Conduct
            </a>
          </ListGroup.Item>
          <ListGroup.Item>
            <a href={termsAndConditionsPDF} target="_blank" rel="noreferrer">
              Terms & Conditions
            </a>
          </ListGroup.Item>
        </ListGroup>
      </Card>
    </Container>
  );
};

export default WelfareFundraisingScreen;
