import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { listEvents, deleteEvent, createEvent } from "../actions/eventActions";
import { EVENT_CREATE_RESET } from "../constants/eventConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import * as Yup from "yup";

import { Formik, Form } from "formik";
import FormikControl from "../components/FormComponents/FormikControl";

const ListEventsScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const eventList = useSelector((state) => state.eventList);
  const { loading, error, events } = eventList;

  const eventDelete = useSelector((state) => state.eventDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = eventDelete;

  const eventCreate = useSelector((state) => state.eventCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    event: createdEvent,
  } = eventCreate;

  useEffect(() => {
    dispatch({ type: EVENT_CREATE_RESET });

    if (!memberInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(listEvents());
    }
  }, [dispatch, history, memberInfo, successDelete, successCreate]);

  const deleteHandler = async () => {
    dispatch(deleteEvent(deleteId));
    setDeleteModal(false);
  };

  const createEventHandler = (values) => {
    dispatch(createEvent(values));
    setCreateModal(false);
  };

  // Form data to create Event
  let initialValues;
  if (member) {
    initialValues = {
      image: "/image",
      title: "",
      author: `${member.nameFirst} ${member.nameSecond}`,
      dateOfEvent: "",
      location: "",
      description: "",
      register: "/event",
      todaysDate: new Date(),
    };
  }
  const validationSchema = Yup.object({
    image: Yup.string(),
    title: Yup.string().required("Required"),
    author: Yup.string(),
    todaysDate: Yup.date(),
    dateOfEvent: Yup.date()
      .required("Required")
      .min(Yup.ref("todaysDate"), "Date of event must be in the future"),
    location: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  return (
    <Container fluid="lg">
      <Link className="btn btn-dark" to="/admin">
        <i className="fas fa-arrow-left"></i> Return
      </Link>
      {loadingDelete && <Loader variant="warning" />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader variant="warning" />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="align-items-center">
            <Col>
              <h3 className="text-center border-bottom border-warning pb-1">
                Events
              </h3>
            </Col>
            <Col className="text-right">
              <Button className="my-3" onClick={() => setCreateModal(true)}>
                <i className="fas fa-plus"></i> Create Event
              </Button>
            </Col>
          </Row>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date of Event</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    <Link to={`/admin/events/${event._id}/edit`}>
                      {event.title}
                    </Link>
                  </td>

                  <td>{new Date(event.dateOfEvent).toLocaleDateString()}</td>
                  <td>
                    {
                      <>
                        <Button
                          variant="light"
                          className="btn-sm"
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(event._id);
                          }}
                        >
                          <i
                            className="fas fa-trash"
                            style={{ color: "red" }}
                          ></i>
                        </Button>

                        <LinkContainer to={`/admin/events/${event._id}/edit`}>
                          <Button variant="light" className="btn-sm">
                            <i
                              className="fas fa-edit"
                              style={{ color: "green" }}
                            ></i>
                          </Button>
                        </LinkContainer>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Event?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the event from the database and
          the details will be irretrievable. <br /> Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={createModal} onHide={() => setCreateModal(false)}>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Create a new event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createEventHandler}
          >
            {({ values }) => (
              <Form>
                <FormikControl
                  control="input"
                  label="title"
                  type="text"
                  name="title"
                />

                <FormikControl
                  control="input"
                  label="Date of Event"
                  type="date"
                  name="dateOfEvent"
                />
                <FormikControl
                  control="input"
                  label="Location"
                  type="text"
                  name="location"
                />

                <FormikControl
                  control="input"
                  as="textarea"
                  label="Please provide a description"
                  name="description"
                  placeholder="Please provide details"
                />
                <Button type="submit">Create</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListEventsScreen;
