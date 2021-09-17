import axios from "axios";
import { useState, useEffect } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  listEvents,
  deleteEvent,
  createEvent,
  listEvent,
  updateEvent,
} from "../actions/eventActions";
import { EVENT_CREATE_RESET } from "../constants/eventConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import * as Yup from "yup";

import { Formik, Form } from "formik";
import FormikControl from "../components/FormComponents/FormikControl";
import eventPlaceholder from "../img/eventplaceholder.jpg";

const ListEventsScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState();
  const [uploadError, setUploadError] = useState(false);

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const eventList = useSelector((state) => state.eventList);
  const { loading, error, events } = eventList;

  const displayEvent = useSelector((state) => state.displayEvent);
  const { error: eventError, event } = displayEvent;

  const eventDelete = useSelector((state) => state.eventDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = eventDelete;

  const eventUpdate = useSelector((state) => state.eventUpdate);
  const { error: errorUpdate, success: successUpdate } = eventUpdate;

  const eventCreate = useSelector((state) => state.eventCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = eventCreate;

  useEffect(() => {
    dispatch({ type: EVENT_CREATE_RESET });

    if (!memberInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(listEvents());
    }
  }, [
    dispatch,
    history,
    memberInfo,
    successDelete,
    successCreate,
    successUpdate,
  ]);

  const deleteHandler = async () => {
    dispatch(deleteEvent(deleteId));
    setDeleteModal(false);
  };

  const createEventHandler = (values) => {
    values.image = image;
    dispatch(createEvent(values));
    setCreateModal(false);
  };

  const editEventHandler = async (values) => {
    values.id = updateId;
    values.image = image;
    dispatch(updateEvent(values));

    setEditModal(false);
  };

  // Form data to create Event
  let initialValues;
  if (member) {
    initialValues = {
      image: "",
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

  let editInitialValues = {};
  if (event) {
    editInitialValues = {
      image: event.image,
      title: event.title,
      author: event.author,
      dateOfEvent: new Date(event.dateOfEvent).toLocaleDateString(),
      todaysDate: new Date(),
      location: event.location,
      description: event.description,
      register: event.register,
      dateCreated: event.dateCreated,
    };
  }

  const uploadEventImage = async (e) => {
    setUploadError(false);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
      setUploadError(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      setUploadError(true);
    }
  };

  return (
    <Container fluid="lg">
      <Link className="btn btn-dark" to="/admin">
        <i className="fas fa-arrow-left"></i> Return
      </Link>
      {loadingDelete && <Loader variant="warning" />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader variant="warning" />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {eventError && <Message variant="danger">{eventError}</Message>}
      {successUpdate && (
        <Message variant="success">Event successfully updated</Message>
      )}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Events
          </h3>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Title</th>
                <th>Date of Event</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td
                    style={{ maxWidth: "40px" }}
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      setUpdateId(event._id);
                      setUploadError(false);
                      await dispatch(listEvent(event._id));
                      await setImage(event.image);
                      await setEditModal(true);
                    }}
                  >
                    <img src={event.image} alt="event" width="10" height="40" />
                  </td>
                  <td
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      setUpdateId(event._id);
                      setUploadError(false);
                      await dispatch(listEvent(event._id));
                      await setImage(event.image);
                      await setEditModal(true);
                    }}
                  >
                    {event.title}
                  </td>

                  <td className="text-center align-middle">
                    {new Date(event.dateOfEvent).toLocaleDateString()}
                  </td>
                  <td className="d-flex">
                    {
                      <>
                        <Button
                          variant="light"
                          className="btn btn-block p-0 text-danger"
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(event._id);
                          }}
                        >
                          <i
                            className="fas fa-trash"
                            style={{ color: "red" }}
                          ></i>{" "}
                          <br />
                          Delete
                        </Button>

                        <Button
                          variant="light"
                          className="btn btn-block m-0 p-0"
                          onClick={async () => {
                            setUpdateId(event._id);
                            setUploadError(false);
                            await dispatch(listEvent(event._id));
                            await setImage(event.image);
                            await setEditModal(true);
                          }}
                        >
                          <i
                            className="fas fa-edit"
                            style={{ color: "green" }}
                          ></i>{" "}
                          <br />
                          Edit
                        </Button>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div>
            <Button
              onClick={() => {
                setCreateModal(true);
                setImage(eventPlaceholder);
              }}
            >
              <i className="fas fa-plus"></i> Create Event
            </Button>
          </div>
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
          <img src={image} alt="" className="event-image" />
          <label className="d-block btn-primary py-2 my-0 text-center custom-fileupload-button text-warning">
            <input type="file" name="image" onChange={uploadEventImage} />
            Add Event Image
          </label>
          {uploading && <Loader variant="warning" />}
          {uploadError && (
            <Message variant="danger">
              File couldn't be uploaded. File must be png/jpg/jpeg and not be
              more than 1MB in size
            </Message>
          )}
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
                  placeholder="Event Title"
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
                  placeholder="Location Address and Post Code"
                />

                <FormikControl
                  control="input"
                  as="textarea"
                  label="Please provide a description"
                  name="description"
                  placeholder="Please provide a description"
                />
                <Button type="submit" className="btn-block">
                  Create
                </Button>
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

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Edit event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={image} alt="" className="event-image" />
          <label className="d-block btn-primary py-2 my-0 text-center custom-fileupload-button text-warning">
            <input type="file" name="image" onChange={uploadEventImage} />
            Change Event Image
          </label>
          {uploading && <Loader variant="warning" />}
          {uploadError && (
            <Message variant="danger">
              File couldn't be uploaded. File must be png/jpg/jpeg and not be
              more than 1MB in size
            </Message>
          )}
          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editEventHandler}
          >
            {({ values }) => (
              <Form>
                <FormikControl
                  control="input"
                  label="title"
                  type="text"
                  name="title"
                  placeholder="Event Title"
                />

                <FormikControl
                  control="input"
                  label="Date of Event"
                  type="text"
                  name="dateOfEvent"
                />
                <FormikControl
                  control="input"
                  label="Location"
                  type="text"
                  name="location"
                  placeholder="Location Address and Post Code"
                />

                <FormikControl
                  control="input"
                  as="textarea"
                  label="Please provide a description"
                  name="description"
                  placeholder="Please provide a description"
                />
                <Button type="submit" className="btn-block">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListEventsScreen;
