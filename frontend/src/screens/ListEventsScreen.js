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
import imagePlaceholder from "../img/defaultplaceholder.jpg";
import UploadImage from "../components/uploadImage";

const ListEventsScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [editDescription, setEditDescription] = useState(false);
  const [image, setImage] = useState();

  const singleImageData = (singleImage) => {
    setImage(singleImage);
  };

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
    if (!memberInfo) {
      history.push("/login");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      dispatch(listEvents());
    }
  }, [
    dispatch,
    history,
    member,
    successDelete,
    successCreate,
    successUpdate,
    memberInfo,
  ]);

  const deleteHandler = async () => {
    dispatch(deleteEvent(deleteId));
    setDeleteModal(false);
  };

  const createEventHandler = (values) => {
    values.image = image;
    values.description = values.description.split("\n");
    dispatch(createEvent(values));
    setCreateModal(false);
  };

  const editEventHandler = async (values) => {
    values.id = updateId;

    if (editDescription === false) {
      values.description = event.description;
    } else {
      values.description = values.description.split("\n");
    }

    dispatch(updateEvent(values));
    setEditDescription(false);
    setEditModal(false);
  };

  let initialValues;
  if (member) {
    initialValues = {
      image: "",
      title: "",
      author: `${member.nameFirst} ${member.nameSecond}`,
      dateOfEvent: "",
      location: "",
      description: "",
      register: "",
      todaysDate: new Date(),
    };
  }

  // Dropdown options for register
  const dropdownOptions = [
    { key: "Please select a method to register", value: "" },
    { key: "Grading", value: `/grading` },
    { key: "Squad Selection", value: "/squadselection" },
    { key: "Email York Karate", value: "mailto:info@yorkkarate.net" },
    {
      key: "Email Welfare Committee",
      value: "mailto:committee@yorkkarate.net",
    },
  ];

  const validationSchema = Yup.object({
    image: Yup.string(),
    title: Yup.string().required("Required"),
    author: Yup.string(),
    todaysDate: Yup.date(),
    dateOfEvent: Yup.date()
      .required("Required")
      .min(Yup.ref("todaysDate"), "Date of event must be in the future"),
    location: Yup.string().required("Required"),
    // description: Yup.string().required("Required"),
    register: Yup.string().required("Required"),
  });

  let editInitialValues = {};
  let paragraphs;

  if (event.title !== undefined) {
    const eventDate = new Date(event.dateOfEvent);
    let year;
    let month;
    let day;
    if (eventDate.getFullYear() < 10) {
      year = `0${eventDate.getFullYear()}`;
    } else {
      year = eventDate.getFullYear();
    }
    if (eventDate.getMonth() < 9) {
      month = `0${eventDate.getMonth() + 1}`;
    } else {
      month = eventDate.getMonth() + 1;
    }
    if (eventDate.getDate() < 10) {
      day = `0${eventDate.getDate()}`;
    } else {
      day = eventDate.getDate();
    }

    paragraphs = event.description;

    const eventDescription = paragraphs.join("\n");

    editInitialValues = {
      title: event.title,
      author: event.author,
      dateOfEvent: `${year}-${month}-${day}`,
      todaysDate: new Date(),
      location: event.location,
      description: eventDescription,
      register: event.register,
      dateCreated: event.dateCreated,
    };
  }

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
        <div className="text-center">
          <Button
            variant="outline-secondary"
            className="py-0"
            onClick={() => {
              setCreateModal(true);
              setImage(imagePlaceholder);
            }}
          >
            <i className="fas fa-plus"></i> Create Event
          </Button>
        </div>
      </div>
      {loadingDelete && <Loader variant="warning" />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader variant="warning" />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {eventError && <Message variant="danger">{eventError}</Message>}

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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td
                    style={{ maxWidth: "80px" }}
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      setUpdateId(event._id);

                      await dispatch(listEvent(event._id));
                      await setImage(event.image);
                      await setEditModal(true);
                    }}
                  >
                    <img src={`${event.image}`} alt="event" max-width="80" />
                  </td>
                  <td
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      setUpdateId(event._id);

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
                  <td>
                    <Button
                      variant="success"
                      className="btn-sm"
                      onClick={async () => {
                        setUpdateId(event._id);

                        await dispatch(listEvent(event._id));
                        await setImage(event.image);
                        await setEditModal(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>{" "}
                    </Button>
                  </td>
                  <td className="align-middle">
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(event._id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            Permanently Delete Event?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the event from the database and
          the details will be irretrievable. <br /> Are you sure?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="light" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={createModal} onHide={() => setCreateModal(false)}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Create a new event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`${image}`} alt="" />
          <UploadImage singleImageData={singleImageData} type="Event" />
          <p className="text-center">
            Recommended aspect ratio: 5:3. Image will be cropped to fit
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createEventHandler}
          >
            {({ values }) => (
              <Form>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    label="Title"
                    type="text"
                    name="title"
                    placeholder="Event Title"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    label="Date of Event"
                    type="date"
                    name="dateOfEvent"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    label="Location"
                    type="text"
                    name="location"
                    placeholder="Location Address and Post Code"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    as="textarea"
                    label="Please provide a description"
                    name="description"
                    placeholder="Please provide a description"
                    rows="10"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="select"
                    label="Event Type / How to Register"
                    name="register"
                    options={dropdownOptions}
                  />
                </div>
                <Button type="submit" className="w-100 mt-2 btn-default">
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
          setEditDescription(false);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Edit event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {event && (
            <>
              <img src={`${image}`} alt="" className="bg-primary p-2" />
              <UploadImage
                img={event.image}
                type={"Event"}
                id={event._id}
                singleImageData={singleImageData}
              />
              <p className="text-center">
                Recommended aspect ratio: 5:3. Image will be cropped to fit
              </p>
            </>
          )}

          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editEventHandler}
          >
            {({ values }) => (
              <Form>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    label="Title"
                    type="text"
                    name="title"
                    placeholder="Event Title"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    label="Date of Event"
                    type="date"
                    name="dateOfEvent"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <FormikControl
                    control="input"
                    label="Location"
                    type="text"
                    name="location"
                    placeholder="Location Address and Post Code"
                  />
                </div>
                <div className="mb-2 p-2 bg-light">
                  <h5 className="mt-2">Description</h5>

                  {!editDescription && (
                    <>
                      {paragraphs &&
                        paragraphs.map((paragraph) => (
                          <p
                            key={`${paragraph}${Math.random()}`}
                            className="mb-2 "
                          >
                            {paragraph}
                            <br />
                          </p>
                        ))}

                      <Button
                        variant="outline-secondary btn-sm"
                        onClick={() => setEditDescription(true)}
                        className="mb-4 btn-sm d-block"
                      >
                        Edit Description?
                      </Button>
                    </>
                  )}
                  {editDescription && (
                    <>
                      <FormikControl
                        control="input"
                        as="textarea"
                        label="Please provide a description"
                        name="description"
                        placeholder="Please enter a new description..."
                        rows="10"
                      />

                      <Button
                        onClick={() => setEditDescription(false)}
                        variant="danger"
                        className="mb-2 btn-sm"
                      >
                        Cancel Edit Description?
                      </Button>
                    </>
                  )}
                </div>

                <Button type="submit" className="w-100 btn-default">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            variant="secondary"
            onClick={() => {
              setEditModal(false);
              setEditDescription(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListEventsScreen;
