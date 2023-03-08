import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listFinancials } from "../actions/financialActions";
import kihonKumiteIMG from "../img/kihonkumite.jpg";
import Loader from "../components/Loader";
import Message from "../components/Message";

const MemberApplicationScreen = () => {
  const dispatch = useDispatch();

  const financialList = useSelector((state) => state.financialList);
  const { loading, error, financials } = financialList;

  useEffect(() => {
    dispatch(listFinancials());
  }, []);

  return (
    <Container className="mt-3">
      <h3 className="text-center border-bottom border-warning pb-1 mb-3">
        Before you apply...
      </h3>
      <Row className="no-gutters text-center bg-primary align-items-center p-3">
        <Col sm={5}>
          <img src={kihonKumiteIMG} alt="" className="max-width-300" />
        </Col>
        <Col sm={7} className="d-flex">
          <Card className="text-white bg-primary flex-fill">
            <Card.Header>Our Trial offer!</Card.Header>
            <Card.Body>
              <Card.Title className="border-bottom border-warning">
                Book a trial session
              </Card.Title>
              <Card.Text>
                Why not try a class first? Book a taster session today. No
                commitment.
              </Card.Text>
              <Link
                to={"/trialregistrationform"}
                className="btn btn-default btn-block btn-sm"
              >
                Book Your Trial session
              </Link>
              <Card.Title className="mt-4 border-bottom border-warning">
                Fees
              </Card.Title>
              <Card.Text>
                {loading ? (
                  <Loader variant="warning" />
                ) : error ? (
                  <Message variant="danger">{error}</Message>
                ) : financials ? (
                  <ul className="list-unstyled">
                    <li>
                      Annual membership:{" "}
                      {(financials.joiningFee / 100).toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      })}
                    </li>
                    <li>
                      Training fees for once a week:{" "}
                      {(financials.baseLevelTrainingFees / 100).toLocaleString(
                        "en-GB",
                        {
                          style: "currency",
                          currency: "GBP",
                        }
                      )}{" "}
                      p/m
                    </li>
                    <li>
                      +{" "}
                      {(financials.costOfAdditionalClass / 100).toLocaleString(
                        "en-GB",
                        {
                          style: "currency",
                          currency: "GBP",
                        }
                      )}{" "}
                      p/m for each additional class per week
                    </li>
                  </ul>
                ) : (
                  "error loading details. Please try again"
                )}
              </Card.Text>
              <Link
                to={"/register"}
                className="btn btn-default btn-block btn-sm"
              >
                Proceed with application
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MemberApplicationScreen;
