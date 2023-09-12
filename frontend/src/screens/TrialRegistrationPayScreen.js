import { useEffect, useState } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { listFinancials } from "../actions/financialActions";
import Loader from "../components/Loader";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import Message from "../components/Message";
import { getTrial, payTrial } from "../actions/trialRegistrationActions";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";
import {
  TRIAL_GET_RESET,
  TRIAL_REGISTER_RESET,
} from "../constants/trialRegistrationConstants";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const TrialRegistrationPayScreen = ({ match }) => {
  const trialClassId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { trainingSessions } = trainingSessionsList;

  const trialGet = useSelector((state) => state.trialGet);
  const { loading: trialLoading, applicant, error: trialError } = trialGet;

  useEffect(() => {
    dispatch(listFinancials());
    dispatch(listTrainingSessions());
    if (!applicant || applicant._id !== trialClassId) {
      dispatch(getTrial(trialClassId));
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=GBP`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (sdkReady === false) {
      dispatch({ type: ORDER_PAY_RESET });
      if (applicant && applicant.paid === false)
        if (!window.paypal) {
          addPayPalScript();
        } else {
          setSdkReady(true);
        }
    }

    paySuccess && resetForm();
  }, [dispatch, applicant, trialClassId, sdkReady, paySuccess]);

  const successPaymentHandler = async () => {
    await dispatch(payTrial(trialClassId));

    setPaySuccess(true);
    console.log("payment success");
  };

  const resetForm = () => {
    setTimeout(() => {
      dispatch({ type: TRIAL_GET_RESET });
      dispatch({ type: TRIAL_REGISTER_RESET });
      history.push("/faq");
    }, "5000");
  };

  let classDetails = "";
  if (applicant) {
    trainingSessions.forEach((trainingSession) => {
      if (trainingSession._id === applicant.classSelection) {
        classDetails = `${trainingSession.name} at ${trainingSession.times}. ${trainingSession.location}`;
      }
    });
  }

  return financialsLoading || trialLoading ? (
    <Loader variant="warning" />
  ) : financialsError ? (
    <Message variant="warning">{financialsError}</Message>
  ) : trialError ? (
    <Message variant="warning">{trialError}</Message>
  ) : (
    <>
      {financials && applicant && (
        <Container className="mt-3">
          <h3 className="text-center border-bottom border-warning pb-1">
            Payment for your trial session
          </h3>
          <Row>
            <Col sm={7}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  Trial for: {applicant.firstName} {applicant.lastName}
                </ListGroup.Item>
                <ListGroup.Item>
                  Class Selected:
                  <br /> {classDetails}
                </ListGroup.Item>
                <ListGroup.Item>
                  Cost:{" "}
                  {(financials.costOfExtraFee / 100).toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-warning">
                    You will be able to attend the session above anytime within
                    the next four weeks.
                  </small>
                </ListGroup.Item>
                <ListGroup.Item>
                  <small className="text-warning">
                    If you fail to attend the session within four weeks, you
                    will not be entitled to a refund.
                  </small>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={5} className="align-self-center">
              {!sdkReady ? (
                <Loader variant="warning" />
              ) : applicant.paid === false && paySuccess === false ? (
                <div className="text-center">
                  {console.log(sdkReady)}
                  <PayPalButton
                    amount={financials.costOfExtraFee.toFixed(2) / 100}
                    onSuccess={successPaymentHandler}
                    currency={"GBP"}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <i className="fa-solid fa-circle-check fa-2x text-success"></i>
                  <h4 className="text-success">Success!</h4>
                  <p>
                    Payment has been succesful. We will send you an email
                    shortly.
                    <br />
                    We look forward to meeting you soon.
                  </p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default TrialRegistrationPayScreen;
