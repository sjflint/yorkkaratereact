import { Form, Formik } from "formik";
import { useState, useEffect } from "react";
import {
  Button,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  createTrainingSession,
  deleteTrainingSession,
  listTrainingSessions,
  updateTrainingSession,
  trainingSessionById,
  cancelTrainingSession,
} from "../actions/trainingSessionActions";
import FormikControl from "../components/FormComponents/FormikControl";
import Loader from "../components/Loader";
import Message from "../components/Message";
import * as Yup from "yup";

const ListClassesScreen = ({ history }) => {
  const [participantsModal, setParticipantsModal] = useState(false);
  const [participantsList, setParticipantsList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [cancelModal, setCancelModal] = useState(false);
  const [classIdToCancel, setClassIdToCancel] = useState("");
  const [dateOfCancelledClass, setDateOfCancelledClass] = useState("");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  const trainingSessionByID = useSelector((state) => state.trainingSessionByID);
  const {
    loading: loadingTrainingSession,
    error: errorTrainingSession,
    trainingSession,
  } = trainingSessionByID;

  const trainingSessionDelete = useSelector(
    (state) => state.trainingSessionDelete
  );
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = trainingSessionDelete;

  const trainingSessionUpdate = useSelector(
    (state) => state.trainingSessionUpdate
  );
  const { error: errorUpdate, success: successUpdate } = trainingSessionUpdate;

  const trainingSessionCreate = useSelector(
    (state) => state.trainingSessionCreate
  );
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = trainingSessionCreate;

  const trainingSessionCancel = useSelector(
    (state) => state.trainingSessionCancel
  );
  const {
    loading: loadingCancel,
    error: errorCancel,
    success: successCancel,
  } = trainingSessionCancel;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login?redirect=admin/editclasses");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      dispatch(listTrainingSessions());
    }
    if (successCancel) {
      setCancelModal(false);
    }
  }, [
    dispatch,
    history,
    memberInfo,
    member,
    successDelete,
    successCreate,
    successUpdate,
    successCancel,
  ]);

  const deleteHandler = async () => {
    dispatch(deleteTrainingSession(deleteId));
    setDeleteModal(false);
  };

  const createTrainingSessionHandler = (values) => {
    if (values.juniorSession === "true") {
      values.juniorSession = true;
    } else {
      values.juniorSession = false;
    }
    values.name = `${values.dayOfWeek} - ${values.description}`;
    values.times = `${values.startTime} - ${values.endTime}`;

    console.log(values);

    dispatch(createTrainingSession(values));
    setCreateModal(false);
  };

  const editTrainingSessionHandler = async (values) => {
    values.id = updateId;
    if (values.juniorSession === "true") {
      values.juniorSession = true;
    } else {
      values.juniorSession = false;
    }
    values.name = `${values.dayOfWeek} - ${values.description}`;
    values.times = `${values.startTime} - ${values.endTime}`;
    dispatch(updateTrainingSession(values));
    setEditModal(false);
  };

  const cancelClassHandler = async () => {
    const classId = classIdToCancel;
    const date = dateOfCancelledClass;

    dispatch(cancelTrainingSession(classId, date));
    // include free classes on membership page
    // list cancelled classes coming up
  };

  const initialValues = {
    location: "",
    minGradeLevel: "",
    maxGradeLevel: "",
    juniorSession: "",
    startTime: "",
    endTime: "",
    capacity: "",
    dayOfWeek: "",
    description: "",
    hallHire: "",
  };

  let editInitialValues;
  if (trainingSession && trainingSession.name) {
    const times = trainingSession.times.split(" ");

    const name = trainingSession.name.split(" ");

    let juniorSession;
    if (trainingSession.juniorSession === true) {
      juniorSession = "true";
    } else {
      juniorSession = "false";
    }
    editInitialValues = {
      dayOfWeek: name[0],
      description: name[2],
      location: trainingSession.location,
      minGradeLevel: Number(trainingSession.minGradeLevel),
      maxGradeLevel: Number(trainingSession.maxGradeLevel),
      juniorSession: juniorSession,
      startTime: times[0],
      endTime: times[2],
      capacity: Number(trainingSession.capacity),
      hallHire: Number(trainingSession.hallHire).toFixed(2),
      // dayOfWeek
      // description
    };
  }

  const validationSchema = Yup.object({
    location: Yup.string().required("Required"),
    minGradeLevel: Yup.number().required("Required"),
    maxGradeLevel: Yup.number().required("Required"),
    juniorSession: Yup.string().required("Required"),
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
    capacity: Yup.number().required("Required"),
    hallHire: Yup.number().required("Required"),
    dayOfWeek: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  // Junior options
  const radioOptions = [
    { key: "Yes - This class is for juniors", value: "true" },
    { key: "No - This class is for Novice level or higher", value: "false" },
  ];

  // Day of week options
  const dayOptions = [
    { key: "Please select day", value: "" },
    { key: "Monday", value: "Monday" },
    { key: "Tuesday", value: "Tuesday" },
    { key: "Wednesday", value: "Wednesday" },
    { key: "Thursday", value: "Thursday" },
    { key: "Friday", value: "Friday" },
    { key: "Saturday", value: "Saturday" },
    { key: "Sunday", value: "Sunday" },
  ];
  // Description options
  const descriptionOptions = [
    { key: "Please select the most appropriate description", value: "" },
    { key: "Junior", value: "Junior" },
    { key: "Novice", value: "Novice" },
    { key: "Novice/Intermediate", value: "Novice/Intermediate" },
    { key: "Intermediate", value: "Intermediate" },
    { key: "Intermediate/Advanced", value: "Intermediate/Advanced" },
    { key: "Advanced", value: "Advanced" },
    { key: "Squad", value: "Squad" },
  ];
  // Min grade options
  const minGradeOptions = [
    { key: "Please select the minimum grade level", value: "" },
    { key: "Beginner", value: 16 },
    { key: "15th kyu", value: 15 },
    { key: "14th kyu", value: 14 },
    { key: "13th kyu", value: 13 },
    { key: "12th kyu", value: 12 },
    { key: "11th kyu", value: 11 },
    { key: "10th kyu or white belt aged 9+", value: 10 },
    { key: "9th kyu", value: 9 },
    { key: "8th kyu", value: 8 },
    { key: "7th kyu", value: 7 },
    { key: "6th kyu", value: 6 },
    { key: "5th kyu", value: 5 },
    { key: "4th kyu", value: 4 },
    { key: "3rd kyu", value: 3 },
  ];

  const maxGradeOptions = [
    { key: "Please select the maximum grade level", value: "" },
    { key: "11th kyu", value: 11 },
    { key: "10th kyu or white belt aged 9+", value: 10 },
    { key: "9th kyu", value: 9 },
    { key: "8th kyu", value: 8 },
    { key: "7th kyu", value: 7 },
    { key: "6th kyu", value: 6 },
    { key: "5th kyu", value: 5 },
    { key: "4th kyu", value: 4 },
    { key: "3rd kyu", value: 3 },
    { key: "2nd kyu", value: 2 },
    { key: "1st kyu", value: 1 },
    { key: "Black Belts", value: 0 },
  ];

  const sorter = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };
  const filteredSessions = trainingSessions.sort(function (a, b) {
    let day1 = a.name.split(" ")[0];
    let day2 = b.name.split(" ")[0];
    return sorter[day1] - sorter[day2];
  });

  const dateToday = new Date();

  return (
    <div className="mt-3">
      <Container fluid="lg">
        {successCancel && (
          <Message variant="success">Class successfuly cancelled</Message>
        )}
        <div className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            className="py-0"
            onClick={() => history.goBack()}
          >
            <i className="fas fa-arrow-left"></i> Return
          </Button>

          <Button
            variant="outline-secondary"
            className="py-0"
            onClick={() => {
              setCreateModal(true);
            }}
          >
            <i className="fas fa-plus"></i> Create Class
          </Button>
        </div>
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Cancellations
          </h3>
          <ListGroup className="mb-3">
            {trainingSessions &&
              trainingSessions.map((trainingSession) => {
                let cancelledClasses = [];
                trainingSession.cancelledClasses.map((classes) => {
                  if (new Date(classes) > dateToday) {
                    return cancelledClasses.push(
                      new Date(classes).toLocaleDateString()
                    );
                  }
                });
                return (
                  cancelledClasses.length > 0 && (
                    <ListGroupItem variant="danger" className="mb-1">
                      <h6>
                        {trainingSession.name} {trainingSession.location} is
                        cancelled on these dates:
                        <br />
                        {cancelledClasses.map((date) => (
                          <>
                            {date}
                            <br />
                          </>
                        ))}
                      </h6>
                    </ListGroupItem>
                  )
                );
              })}
          </ListGroup>
        </>
        <h3 className="text-center border-bottom border-warning pb-1">
          Classes
        </h3>
        {loadingDelete && <Loader variant="warning" />}
        {errorDelete && <Message variant="danger">{errorDelete}</Message>}
        {loadingCreate && <Loader variant="warning" />}
        {errorCreate && <Message variant="danger">{errorCreate}</Message>}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading && <Loader variant="warning" />}
        {error && <Message variant="danger">{error}</Message>}

        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm text-center"
        >
          <thead>
            <tr className="text-center">
              <th>Day</th>
              <th>Location</th>
              <th>Time</th>
              <th>Participants</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((trainingSession) => (
              <tr key={trainingSession._id}>
                <td>
                  <small>{trainingSession.name}</small>
                  <br />
                  <Button
                    variant="outline-danger"
                    className="py-0"
                    onClick={() => {
                      setCancelModal(true);
                      setClassIdToCancel("");
                      setClassIdToCancel(trainingSession._id);
                    }}
                  >
                    <i className="fas fa-minus"></i> Cancel Class
                  </Button>
                </td>
                <td>
                  <small className="max-width-200">
                    {trainingSession.location}
                  </small>
                </td>
                <td>
                  <small>{trainingSession.times}</small>
                </td>

                <td>
                  <small>
                    {trainingSession.numberBooked} / {trainingSession.capacity}{" "}
                  </small>
                  <button
                    className="btn btn-sm btn-outline-secondary py-0 mt-1 w-100"
                    onClick={() => {
                      setParticipantsModal(true);
                      setParticipantsList(trainingSession.participants);
                    }}
                  >
                    Participants
                  </button>
                </td>
                <td>
                  <Button
                    variant="success"
                    className="btn btn-sm"
                    onClick={async () => {
                      setUpdateId(trainingSession._id);
                      await dispatch(trainingSessionById(trainingSession._id));
                      await setEditModal(true);
                    }}
                  >
                    <i className="fas fa-edit"></i>{" "}
                  </Button>
                </td>
                <td>
                  {trainingSession.participants.length > 0 ? (
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id={`tooltip`}>
                          <strong>
                            Unable to delete class as participants still
                            registered.
                          </strong>
                        </Tooltip>
                      }
                    >
                      <Button variant="danger" className="btn btn-sm">
                        <i className="fas fa-trash"></i>
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    <Button
                      variant="danger"
                      className="btn btn-sm"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(trainingSession._id);
                      }}
                    >
                      <i className="fas fa-trash"></i>{" "}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-center"></div>
      </Container>

      <Modal
        show={participantsModal}
        onHide={() => setParticipantsModal(false)}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">List of Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {participantsList.length === 0 ? (
                <p className="text-center text-warning">The class is empty!</p>
              ) : (
                participantsList.map((participant) => (
                  <tr key={participant._id}>
                    <td>
                      <Link to={`members/${participant._id}/edit`}>
                        {participant.firstName} {participant.lastName}
                      </Link>
                    </td>
                    <td>
                      <a href={`mailto: ${participant.email}`}>
                        {participant.email}
                      </a>
                    </td>
                    <td>
                      {" "}
                      <a href={`tel:0${participant.phone}`}>
                        0{participant.phone}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          {" "}
          <Button
            variant="secondary"
            onClick={() => {
              setParticipantsModal(false);
              setParticipantsList([]);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            Permanently Delete Training Session?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the event from the database and
          the details will be irretrievable. <br /> Are you sure?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={createModal} onHide={() => setCreateModal(false)}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Create a new Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createTrainingSessionHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Day of the week"
                    name="dayOfWeek"
                    options={dayOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Class Description"
                    name="description"
                    options={descriptionOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Location"
                    type="text"
                    name="location"
                    placeholder="Address and post code of the class"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Minimum Grade Level"
                    name="minGradeLevel"
                    options={minGradeOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Maximum Grade Level"
                    name="maxGradeLevel"
                    options={maxGradeOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Maximum Capacity"
                    type="number"
                    name="capacity"
                    placeholder="Maximum capacity of the class"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Hall Hire (£)"
                    type="number"
                    name="hallHire"
                    placeholder="cost of hiring the hall"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Start Time"
                    type="time"
                    name="startTime"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="End Time"
                    type="time"
                    name="endTime"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="radio"
                    label="Is this a Junior session (for under 9's only)?"
                    name="juniorSession"
                    options={radioOptions}
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-block btn-default w-100 my-2"
                >
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

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Edit Class Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingTrainingSession && <Loader variant="warning" />}
          {errorTrainingSession && <Message>{errorTrainingSession}</Message>}
          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editTrainingSessionHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Day of the week"
                    name="dayOfWeek"
                    options={dayOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Class Description"
                    name="description"
                    options={descriptionOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Location"
                    type="text"
                    name="location"
                    placeholder="Address and post code of the class"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Minimum Grade Level"
                    name="minGradeLevel"
                    options={minGradeOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Maximum Grade Level"
                    name="maxGradeLevel"
                    options={maxGradeOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Maximum Capacity"
                    type="number"
                    name="capacity"
                    placeholder="Maximum capacity of the class"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Hall Hire (£)"
                    type="number"
                    name="hallHire"
                    placeholder="cost of hiring the hall"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Start Time"
                    type="time"
                    name="startTime"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="End Time"
                    type="time"
                    name="endTime"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="radio"
                    label="Is this a Junior session (for under 9's only)?"
                    name="juniorSession"
                    options={radioOptions}
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-block btn-default w-100 my-2"
                >
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* cancel class modal */}
      <Modal show={cancelModal} onHide={() => setCancelModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            Cancel this class (
            {trainingSessions &&
              classIdToCancel !== "" &&
              trainingSessions.map((trainingSession) => {
                if (trainingSession._id === classIdToCancel) {
                  return trainingSession.location;
                }
              })}
            ) on the specified date below
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorCancel && <Message variant="danger">{errorCancel}</Message>}
          <p>Please specify the date of the cancelled class</p>
          <form className="p-2">
            <input
              type="date"
              onChange={(e) => setDateOfCancelledClass(e.target.value)}
            />
          </form>
          This action will cancel the class on the selected date. This action
          cannot be undone <br /> Are you sure?
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            Close
          </Button>
          {loadingCancel ? (
            <Button variant="danger" onClick={cancelClassHandler}>
              <Loader />
            </Button>
          ) : (
            <Button variant="danger" onClick={cancelClassHandler}>
              Cancel Class
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListClassesScreen;
