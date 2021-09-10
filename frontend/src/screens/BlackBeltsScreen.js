import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import BlackBelt from "../components/BlackBelt";
import { listBlackBelts } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const BlackBeltScreen = () => {
  const dispatch = useDispatch();

  const blackBeltList = useSelector((state) => state.blackBeltList);
  const { loading, error, blackBelts } = blackBeltList;

  useEffect(() => {
    dispatch(listBlackBelts());
  }, [dispatch]);

  return (
    <>
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
          <Row>
            {blackBelts.map((blackBelt) => (
              <Col
                sm={6}
                md={6}
                lg={4}
                key={blackBelt._id}
                className="d-flex align-items-stretch"
              >
                <BlackBelt blackBelt={blackBelt} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default BlackBeltScreen;
