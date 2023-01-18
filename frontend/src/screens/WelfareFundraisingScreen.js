import React, { useEffect } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import candleLightersLogoIMG from "../img/candlelighterslogo.png";
import riskAssessmentPDF from "../documents/riskAssessment.pdf";
import athletesCodeOfConductPDF from "../documents/athletesCodeOfConduct.pdf";
import childProtectionPDF from "../documents/childProtection.pdf";
import complaintsProcedurePDF from "../documents/complaintsProcedure.pdf";
import disciplinaryRulesPDF from "../documents/disciplinaryRules.pdf";
import instructorCodeOfConductPDF from "../documents/instructorCodeOfConduct.pdf";
import parentsCodeOfConductPDF from "../documents/parentsCodeOfConduct.pdf";
import reportingConcernsPDF from "../documents/reportingConcerns.pdf";
import termsAndConditionsPDF from "../documents/termsAndConditions.pdf";
import { useDispatch, useSelector } from "react-redux";
import {
  listMemberWelfareMembers,
  listPublicWelfareMembers,
} from "../actions/memberActions";
import { LIST_WELFARE_PUBLIC_CLEAR } from "../constants/memberConstants";

const WelfareFundraisingScreen = () => {
  const dispatch = useDispatch();
  // What info do we want?
  // Public - name, image
  // Members = name, image, email, phone
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const welfareMemberPublic = useSelector((state) => state.welfareMemberPublic);
  const { welfarePublicList } = welfareMemberPublic;

  const welfareMember = useSelector((state) => state.welfareMember);
  const { welfareMemberList } = welfareMember;

  useEffect(() => {
    if (memberInfo && !welfareMemberList) {
      dispatch({ type: LIST_WELFARE_PUBLIC_CLEAR });
      console.log("logged in");
      dispatch(listMemberWelfareMembers());
    } else if (!memberInfo && !welfarePublicList) {
      console.log("not logged in - show public page");
      dispatch(listPublicWelfareMembers());
    }
  }, [welfarePublicList, welfareMemberList, dispatch, memberInfo]);

  return (
    <Container className="mt-3">
      <h3 className="text-center border-bottom border-warning pb-1">
        Welfare and Fundraising
      </h3>
      <Row className="mb-4 border-bottom border-warning pb-1">
        {welfarePublicList &&
          welfarePublicList.map((member, index) => {
            return (
              <Col sm={6} md={4}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={member.profileImg}
                    alt="profile"
                  />
                  <Card.Body>
                    <Card.Title className="text-center text-warning py-1">
                      {`${member.firstName} ${member.lastName}`}
                    </Card.Title>
                    <Card.Text className="text-center">
                      {index === 0 ? "Lead Welfare Officer" : "Welfare Officer"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        {welfareMemberList &&
          welfareMemberList.map((member, index) => {
            return (
              <Col sm={6} md={4}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={member.profileImg}
                    alt="profile"
                  />
                  <Card.Body className="text-center">
                    <Card.Title className="text-warning py-1">
                      {`${member.firstName} ${member.lastName}`}
                    </Card.Title>
                    <Card.Text>
                      {index === 0 ? "Lead Welfare Officer" : "Welfare Officer"}
                    </Card.Text>
                    <Card.Text>
                      <small>{member.email}</small>
                    </Card.Text>
                    <Card.Text>
                      <small>0{member.phone}</small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
      </Row>
      <Row>
        <Col md={4}>
          <Card className="my-3 text-center">
            <Card.Header className="bg-primary text-white">
              Club Policies
            </Card.Header>
            <ListGroup>
              <ListGroup.Item>
                <a href={riskAssessmentPDF} target="_blank" rel="noreferrer">
                  Risk Assessment
                </a>
              </ListGroup.Item>
              <ListGroup.Item>
                <a
                  href={complaintsProcedurePDF}
                  target="_blank"
                  rel="noreferrer"
                >
                  Complaints Procedure
                </a>
              </ListGroup.Item>
              <ListGroup.Item>
                <a href={reportingConcernsPDF} target="_blank" rel="noreferrer">
                  Reporting Concerns
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
                <a
                  href={athletesCodeOfConductPDF}
                  target="_blank"
                  rel="noreferrer"
                >
                  Athletes Code of Conduct
                </a>
              </ListGroup.Item>
              <ListGroup.Item>
                <a
                  href={parentsCodeOfConductPDF}
                  target="_blank"
                  rel="noreferrer"
                >
                  Parents Code of Conduct
                </a>
              </ListGroup.Item>
              <ListGroup.Item>
                <a
                  href={termsAndConditionsPDF}
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms & Conditions
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <h4 className="pb-1">The Welfare Officers</h4>
          <p>
            The welfare Officers are there to uphold the club's policies and
            procedures, including the code of conduct and the child protection
            policy.
          </p>
          <p className="lead pt-4 pb-1">External Contacts</p>
          <p>
            York Karate is associated with the English Karate Federation. As
            such, welfare concerns can be raised directly with the English
            Karate Federation: <br />
            <a
              href="mailto:cpo@englishkaratefederation.com"
              target="_blank"
              rel="noreferrer"
              className="text-warning"
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
              className="text-warning"
            >
              www.childline.org.uk
            </a>
          </p>
          <p className="lead">Complaint Procedure</p>
          <p>
            Should you be unhappy and wish to complain about any aspect of York
            Karate, you can make a formal complaint that will be investigated by
            the club. Please click below for our complaints procedure: <br />
            <a
              href={complaintsProcedurePDF}
              target="_blank"
              rel="noreferrer"
              className="text-warning"
            >
              York Karate Complaints Procedure
            </a>
          </p>
          <p className="lead">Fundraising</p>
          <p>
            The club will also be organising regular events to raise money for
            the club members. This money could be spent on such things as:
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
            on our social media. The club is always looking for volunteers to
            assist with the organisation and planning of events. Please contact
            us if you would like to help.
          </p>
          <p className="lead">Charity - Candlelighters</p>
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
    </Container>
  );
};

export default WelfareFundraisingScreen;
