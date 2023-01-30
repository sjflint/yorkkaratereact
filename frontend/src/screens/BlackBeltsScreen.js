import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import BlackBelt from "../components/BlackBelt";
import FormerBlackBelt from "../components/FormerBlackBelt";
import { listBlackBelts, listFormerBlackBelts } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const BlackBeltScreen = () => {
  const dispatch = useDispatch();

  const blackBeltList = useSelector((state) => state.blackBeltList);
  const { loading, error, blackBelts } = blackBeltList;

  const formerBlackBeltList = useSelector((state) => state.formerBlackBeltList);
  const {
    loading: formerLoading,
    error: formerError,
    formerBlackBelts,
  } = formerBlackBeltList;

  useEffect(() => {
    dispatch(listBlackBelts());
    dispatch(listFormerBlackBelts());
  }, [dispatch]);

  return (
    <div className="mt-3">
      <Container>
        <h3 className="text-center border-bottom border-warning pb-1">
          Club Black Belts
        </h3>
        {loading ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading black belts">
            {error}
          </Message>
        ) : (
          <Row className="mb-4">
            {blackBelts.map((blackBelt) => (
              <>
                <Col
                  sm={6}
                  md={6}
                  lg={4}
                  key={blackBelt._id}
                  className="d-flex align-items-stretch"
                >
                  <BlackBelt blackBelt={blackBelt} />
                </Col>
              </>
            ))}
          </Row>
        )}
        <h3 className="text-center border-bottom border-warning pb-1">
          Former Black Belts
        </h3>
        <p>
          We are proud of every member who progressed to black belt whilst
          training at our club, and are thankful for what they contributed.
        </p>
        {formerLoading ? (
          <Loader variant="warning" />
        ) : formerError ? (
          <Message variant="warning" heading="Error loading black belts">
            {error}
          </Message>
        ) : (
          <Row>
            {formerBlackBelts.map((blackBelt) => (
              <>
                <Col
                  xs={6}
                  sm={6}
                  md={4}
                  lg={3}
                  key={blackBelt._id}
                  className="d-flex align-items-stretch"
                >
                  <FormerBlackBelt blackBelt={blackBelt} />
                </Col>
              </>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default BlackBeltScreen;
