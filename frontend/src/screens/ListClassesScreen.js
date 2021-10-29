import { Form, Formik } from "formik";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  Button,
  Container,
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

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

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

  useEffect(() => {
    if (!memberInfo || !memberInfo.isAdmin) {
      history.push("/login?redirect=admin/editclasses");
    } else {
      dispatch(listTrainingSessions());
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
  ];
  // Description options
  const descriptionOptions = [
    { key: "Please select the most appropriate description", value: "" },
    { key: "Junior", value: "Junior" },
    { key: "Novice", value: "Novice" },
    { key: "Intermediate", value: "Intermediate" },
    { key: "Advanced", value: "Advanced" },
    { key: "Kata", value: "Kata" },
    { key: "Kumite", value: "Kumite" },
    { key: "Open", value: "Open" },
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

  return (
    <>
      <Container fluid="lg">
        <Link className="btn btn-dark" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
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
              <th>Grade Range (kyu)</th>
              <th>Participants</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {trainingSessions.map((trainingSession) => (
              <tr key={trainingSession._id}>
                <td>{trainingSession.name}</td>
                <td style={{ maxWidth: "100px" }}>
                  {trainingSession.location}
                </td>
                <td>{trainingSession.times}</td>
                <td>
                  {trainingSession.minGradeLevel + "kyu"} -{" "}
                  {trainingSession.maxGradeLevel === 0
                    ? "Black Belts"
                    : trainingSession.maxGradeLevel + "kyu"}
                </td>
                <td>
                  {trainingSession.numberBooked} / {trainingSession.capacity}{" "}
                  <br />
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => {
                      setParticipantsModal(true);
                      setParticipantsList(trainingSession.participants);
                    }}
                  >
                    View Participants
                  </button>
                </td>
                <td>
                  <Button
                    variant="light"
                    className="btn btn-block p-1 m-1"
                    onClick={async () => {
                      setUpdateId(trainingSession._id);
                      await dispatch(trainingSessionById(trainingSession._id));
                      await setEditModal(true);
                    }}
                  >
                    <i className="fas fa-edit" style={{ color: "green" }}></i>{" "}
                    <br />
                    Edit
                  </Button>

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
                      <Button
                        variant="light"
                        className="btn btn-block p-1 m-1 text-danger"
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "red" }}
                        ></i>{" "}
                        <br />
                        Delete
                      </Button>
                    </OverlayTrigger>
                  ) : (
                    <Button
                      variant="light"
                      className="btn btn-block p-1 m-1 text-danger"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(trainingSession._id);
                      }}
                    >
                      <i className="fas fa-trash" style={{ color: "red" }}></i>{" "}
                      <br />
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-center">
          <Button
            className="btn-secondary"
            onClick={() => {
              setCreateModal(true);
            }}
          >
            <i className="fas fa-plus"></i> Create Class
          </Button>
        </div>
      </Container>

      <Modal
        show={participantsModal}
        onHide={() => setParticipantsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>List of Participants</Modal.Title>
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
              {participantsList.map((participant) => (
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
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
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
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Training Session?</Modal.Title>
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
          <Modal.Title>Create a new Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createTrainingSessionHandler}
          >
            {({ values }) => (
              <Form>
                <FormikControl
                  control="select"
                  label="Day of the week"
                  name="dayOfWeek"
                  options={dayOptions}
                />
                <FormikControl
                  control="select"
                  label="Class Description"
                  name="description"
                  options={descriptionOptions}
                />
                <FormikControl
                  control="input"
                  label="Location"
                  type="text"
                  name="location"
                  placeholder="Address and post code of the class"
                />

                <FormikControl
                  control="select"
                  label="Minimum Grade Level"
                  name="minGradeLevel"
                  options={minGradeOptions}
                />
                <FormikControl
                  control="select"
                  label="Maximum Grade Level"
                  name="maxGradeLevel"
                  options={maxGradeOptions}
                />

                <FormikControl
                  control="input"
                  label="Maximum Capacity"
                  type="number"
                  name="capacity"
                  placeholder="Maximum capacity of the class"
                />
                <FormikControl
                  control="input"
                  label="Start Time"
                  type="time"
                  name="startTime"
                />
                <FormikControl
                  control="input"
                  label="End Time"
                  type="time"
                  name="endTime"
                />
                <FormikControl
                  control="radio"
                  label="Is this a Junior session (for under 9's only)?"
                  name="juniorSession"
                  options={radioOptions}
                />
                <Button type="submit" className="btn-block btn-secondary">
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
          <Modal.Title>Edit Class Details</Modal.Title>
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
                <FormikControl
                  control="select"
                  label="Day of the week"
                  name="dayOfWeek"
                  options={dayOptions}
                />
                <FormikControl
                  control="select"
                  label="Class Description"
                  name="description"
                  options={descriptionOptions}
                />
                <FormikControl
                  control="input"
                  label="Location"
                  type="text"
                  name="location"
                  placeholder="Address and post code of the class"
                />

                <FormikControl
                  control="select"
                  label="Minimum Grade Level"
                  name="minGradeLevel"
                  options={minGradeOptions}
                />
                <FormikControl
                  control="select"
                  label="Maximum Grade Level"
                  name="maxGradeLevel"
                  options={maxGradeOptions}
                />

                <FormikControl
                  control="input"
                  label="Maximum Capacity"
                  type="number"
                  name="capacity"
                  placeholder="Maximum capacity of the class"
                />
                <FormikControl
                  control="input"
                  label="Start Time"
                  type="time"
                  name="startTime"
                />
                <FormikControl
                  control="input"
                  label="End Time"
                  type="time"
                  name="endTime"
                />
                <FormikControl
                  control="radio"
                  label="Is this a Junior session (for under 9's only)?"
                  name="juniorSession"
                  options={radioOptions}
                />
                <Button type="submit" className="btn-block btn-secondary">
                  Update
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
    </>
  );
};

export default ListClassesScreen;
