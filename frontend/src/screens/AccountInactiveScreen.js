import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import { directDebitUpdate } from "../actions/directDebitActions";
import { useHistory } from "react-router";

const AccountInactiveScreen = () => {
  const dispatch = useDispatch();

  let history = useHistory();

  const memberDetails = useSelector((state) => state.memberDetails);
  const { loading, member } = memberDetails;

  const updateDirectDebit = useSelector((state) => state.updateDirectDebit);
  const { ddSetupInfo } = updateDirectDebit;

  useEffect(() => {
    if (ddSetupInfo && ddSetupInfo !== null) {
      localStorage.removeItem("updateDD");
      window.location.href = `https://pay-sandbox.gocardless.com/flow/${ddSetupInfo.ddRedirect}`;
    }
  }, [history, ddSetupInfo]);

  return (
    <Container fluid="lg" className="mt-3">
      {loading ? (
        <Loader variant="default" />
      ) : (
        <Row>
          <Col lg="3" md="4" xs="6">
            <img src={member.profileImg} alt="" />
          </Col>
          <Col className="text-center">
            <h3 className="border-bottom border-warning pb-1">
              {member.nameFirst} {member.nameSecond}'s Account is Inactive
            </h3>
            <p>
              Unfortunately, your account is now inactive because your direct
              debit was cancelled. Perhaps you did this yourself or maybe your
              bank cancelled the direct debit.
            </p>
            <h5 className="text-warning">Let's get you back going again!</h5>
            <p>
              All you need to do is create a new direct debit. Please note that
              although your account will be reinstated, your class bookings will
              not. After regaining access to your account, please visit the
              'Class Bookings' section to re-book your classes.
            </p>
            <Button
              variant="default"
              onClick={() => dispatch(directDebitUpdate())}
            >
              Setup New Direct Debit and Re-Activate account
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AccountInactiveScreen;
