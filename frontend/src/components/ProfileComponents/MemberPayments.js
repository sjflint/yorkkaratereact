import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  cancelDirectDebit,
  directDebitUpdate,
} from "../../actions/directDebitActions";
import { Button, Col, ListGroup, Modal, Row } from "react-bootstrap";
import dojoImg from "../../img/dojo.jpeg";
import Loader from "../Loader";
import { getMemberDetails, logout } from "../../actions/memberActions";

const MemberPayments = () => {
  const dispatch = useDispatch();

  const [cancelModal, setCancelModal] = useState(false);

  let history = useHistory();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const directDebit = useSelector((state) => state.updateDirectDebit);
  const { ddSetupInfo } = directDebit;

  const cancelledDirectDebit = useSelector((state) => state.cancelDirectDebit);
  const { loading, error, success } = cancelledDirectDebit;

  const changeDDHandler = async () => {
    if (memberInfo) {
      dispatch(directDebitUpdate());
    }
  };

  const cancelHandler = async () => {
    if (memberInfo) {
      await dispatch(cancelDirectDebit());
      await dispatch(getMemberDetails("profile"));
      await dispatch(logout());
    }
  };

  useEffect(() => {
    if (ddSetupInfo && ddSetupInfo !== null) {
      localStorage.removeItem("updateDD");
      window.location.href = `https://pay.gocardless.com/flow/${ddSetupInfo.ddRedirect}`;
    }
  }, [history, ddSetupInfo]);

  return (
    <>
      <img src={dojoImg} alt="dojo" />
      <h2 className="border-bottom border-warning mt-2 text-warning text-center">
        Amend Payment Details
      </h2>
      <ListGroup>
        <ListGroup.Item variant="light">
          <Row>
            <Col className="align-self-center">
              <h5>Change Your Direct Debit Bank Account Details?</h5>
            </Col>
            <Col>
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={changeDDHandler}
                disabled={success && true}
              >
                Change Details
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>
        <ul className="mt-2">
          <li>
            For security purposes, your bank account details are not shown here.
            Please refer to your bank statements or online banking and look for
            the reference 'York Karate' to identify the transaction
          </li>
          <li>
            Changing your bank account details will cancel your existing direct
            debit and set up a new one. Any payments in the process of being
            collected from the old direct debit will still be collected and it
            will take up to 5 working days to set up the new direct debit.
          </li>
          <li>
            Please contact us on{" "}
            <a
              href="mailto:info@yorkkarate.net"
              target="_blank"
              rel="noreferrer"
            >
              info@yorkkarate.net
            </a>{" "}
            for advice or if you believe payments have been taken in error.
          </li>
        </ul>
        <ListGroup.Item variant="light">
          <Row>
            <Col className="align-self-center">
              <h5>Cancel your membership?</h5>
            </Col>
            <Col>
              <Button
                variant="danger"
                className="w-100"
                onClick={() => setCancelModal(true)}
              >
                Cancel Membership
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>
        <ul className="mt-2">
          <li>
            If you cancel your membership, we will cancel your direct debit
            immeidately. Please note, any payments in the process of being
            collected will still be collected.
          </li>
          <li>
            Your account will be immediately closed and you will lose access to
            all classes and membership facilities.
          </li>
          <li>
            You may still attend classes until the end of the calendar month
          </li>
          <li>
            If you wish to rejoin York Karate after cancelling, you will need to
            apply as a new member.
          </li>
          <li>
            Cancelling your membership with York Karate Dojo does not cancel any
            subscriptions you may have with JKS England. Please contact them
            directly to arrange this (
            <a href="www.jksengland.com" target="_blank" rel="noreferrer">
              www.jksengland.com
            </a>
            )
          </li>
        </ul>
      </ListGroup>

      {/* Cancel modal */}
      <Modal show={cancelModal} onHide={() => setCancelModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            <i className="fas fa-exclamation-circle"></i> Cancel Membership?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-primary">
          {loading ? (
            <Loader />
          ) : error ? (
            <>
              <h5>{error}</h5>
              <h5>Please contact us for Assistance</h5>
            </>
          ) : success ? (
            <>
              <h5>{`Mandate ID: ${success.Mandate}`}</h5>
              <h5>{`Status: '${success.Status}'`}</h5>
            </>
          ) : (
            <>
              Are you sure you wish to cancel your membership with York Karate
              Dojo? This cannot be undone.
              <Row className="mt-5">
                <Col>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setCancelModal(false)}
                  >
                    Back
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="danger"
                    className="w-100"
                    onClick={cancelHandler}
                  >
                    Cancel Membership
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MemberPayments;
