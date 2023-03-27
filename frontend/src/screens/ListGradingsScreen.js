import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  ListGroup,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listEvents } from "../actions/eventActions";
import { listFinancials, updateFinancials } from "../actions/financialActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ListGradingsScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [beltModal, setBeltModal] = useState(false);
  const [updateBelts, setUpdateBelts] = useState();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const eventList = useSelector((state) => state.eventList);
  const { loading, error, events } = eventList;

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

  // const displayEvent = useSelector((state) => state.displayEvent);
  // const { error: eventError, event } = displayEvent;

  let filteredEvents = [];
  if (events) {
    filteredEvents = events.filter((event) => event.register === "/grading");
  }

  useEffect(() => {
    if (!memberInfo) {
      history.push(`/login?redirect=instructor/editgradings`);
    } else if (!memberInfo.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listEvents());
      dispatch(listFinancials());
    }

    if (financials && !updateBelts) {
      {
        setUpdateBelts(financials.belts);
      }
    }
  }, [dispatch, history, memberInfo, member]);

  let belts = 0;
  let keys;
  if (financials && financials.belts) {
    Object.values(financials.belts).forEach((val) => {
      if (val !== "Fully Stocked") {
        belts = belts + val;
      }
      keys = Object.keys(financials.belts);
    });
    if (!updateBelts) {
      setUpdateBelts(financials.belts);
    }
  }

  const handleChange = (value, key) => {
    setUpdateBelts((prevState) => ({
      ...prevState,
      [key]: Number(value),
    }));
  };

  const saveBelts = async () => {
    // dispatch update belts function seperate to financial dispatch

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.put("/api/financial", updateBelts, config);

    console.log(data);
    if (data) {
      dispatch(listFinancials());
      setUpdateBelts(false);
    }
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
      </div>

      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Grading Courses
          </h3>
          <Row className="my-3">
            <Col md={4}>
              <Form.Select
                onChange={(e) => dispatch(listEvents(e.target.value))}
                className="d-inline"
              >
                <option value={0}>View Past Events</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last 12 months</option>
                <option value={1095}>Last 36 months</option>
              </Form.Select>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Title</th>
                <th>Date of Event</th>
                <th>Number of Participants</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents
                .map((event) => (
                  <tr key={event._id}>
                    <td className="text-center align-middle max-width-200">
                      <img
                        src={event.image}
                        alt="grading course"
                        max-width="80"
                      />
                    </td>
                    <td className="text-center align-middle">{event.title}</td>
                    <td className="text-center align-middle">
                      {new Date(event.dateOfEvent).toLocaleDateString()}
                    </td>
                    <td className="text-center align-middle">
                      {event.participants.length}
                    </td>
                    <td className="text-center align-middle">
                      <a href={`/gradingdetails/${event._id}`}>
                        <Button variant="warning" className="btn-sm">
                          <i className="fa-solid fa-eye"></i>
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))
                .reverse()}
            </tbody>
          </Table>
          <small>
            To edit/delete a grading course, please visit the{" "}
            <Link to="/admin/editevents" className="text-info">
              Events page
            </Link>{" "}
            if you have admin access.
          </small>
        </>
      )}
      {belts > 0 && (
        <Button
          variant="danger"
          onClick={() => setBeltModal(true)}
          className="d-block mx-auto mt-3"
        >
          <i className="fa-solid fa-circle-exclamation"> </i> Update Belts in
          Stock <i className="fa-solid fa-circle-exclamation"></i>
        </Button>
      )}

      <Modal show={beltModal} onHide={() => setBeltModal(false)}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Belts To Order</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light text-dark text-center">
          {keys &&
            keys.map((key, index) => (
              <ListGroup.Item key={index}>
                {key === "15"
                  ? "White Belt / Red Stripe"
                  : key === "14"
                  ? "White Belt / Black Stripe"
                  : key === "13"
                  ? "Orange Belt"
                  : key === "12"
                  ? "Orange Belt / White Stripe"
                  : key === "11"
                  ? "Ornage Belt / Yellow Stripe"
                  : key === "9"
                  ? "Red"
                  : key === "8"
                  ? "Red Black Stripe"
                  : key === "7"
                  ? "Yellow"
                  : key === "6"
                  ? "Green"
                  : key === "5"
                  ? "Purple"
                  : key === "4"
                  ? "Purple White Stripe"
                  : key === "3"
                  ? "Brown"
                  : key === "2"
                  ? "Brown White Stripe"
                  : key === "1"
                  ? "Brown Two White Stripes"
                  : "Black belts"}
                <br />
                {updateBelts && (
                  <input
                    className="text-center"
                    value={updateBelts[key]}
                    onChange={(e) => handleChange(e.target.value, key)}
                  />
                )}
              </ListGroup.Item>
            ))}
        </Modal.Body>
        <Modal.Footer className="bg-primary">
          <Button
            variant="warning"
            className="btn-block"
            onClick={() => {
              saveBelts();
              setBeltModal(false);
            }}
          >
            Update Belt Stock
          </Button>
          <Button
            variant="secondary"
            className="btn-block"
            onClick={() => setBeltModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListGradingsScreen;
