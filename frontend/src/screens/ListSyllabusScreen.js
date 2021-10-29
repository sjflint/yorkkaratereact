import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Row,
  Col,
  Card,
  FormControl,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  listTrainingVideos,
  deleteTrainingVideo,
  createTrainingVideo,
  listTrainingVideo,
  updateTrainingVideo,
} from "../actions/TrainingVideoActions";
import { TRAINING_VIDEO_CREATE_RESET } from "../constants/trainingVideoConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";

import juniorImg from "../img/juniorclass.jpg";
import noviceImg from "../img/novice.jpg";
import intermediateImg from "../img/intermediate.jpg";
import advancedImg from "../img/advanced.png";
import * as Yup from "yup";
import FormikControl from "../components/FormComponents/FormikControl";
import { Formik, Form } from "formik";

const ListSyllabusScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [level, setLevel] = useState("All Levels");
  const [grade, setGrade] = useState("All Grades");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const trainingVideoList = useSelector((state) => state.trainingVideoList);
  const { loading, error, trainingVideos } = trainingVideoList;

  const displayTrainingVideo = useSelector(
    (state) => state.displayTrainingVideo
  );
  const { error: trainingVideoError, trainingVideo } = displayTrainingVideo;

  const trainingVideoDelete = useSelector((state) => state.trainingVideoDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = trainingVideoDelete;

  const trainingVideoUpdate = useSelector((state) => state.trainingVideoUpdate);
  const { error: errorUpdate, success: successUpdate } = trainingVideoUpdate;

  const trainingVideoCreate = useSelector((state) => state.trainingVideoCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = trainingVideoCreate;

  useEffect(() => {
    dispatch({ type: TRAINING_VIDEO_CREATE_RESET });

    if (!memberInfo.isInstructor) {
      history.push("/login");
    } else {
      dispatch(listTrainingVideos());
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
    dispatch(deleteTrainingVideo(deleteId));
    setDeleteModal(false);
  };

  const createTrainingVideoHandler = (values) => {
    dispatch(createTrainingVideo(values));
    setCreateModal(false);
  };

  const editTrainingVideoHandler = async (values) => {
    values.id = updateId;

    dispatch(updateTrainingVideo(values));
    setEditModal(false);
  };

  let initialValues;
  if (trainingVideos) {
    initialValues = {
      grade: [],
      title: "",
      img: "",
      video: "",
      soundFile: "",
      category: "",
    };
  }

  // Dropdown options for category
  const categoryOptions = [
    { key: "Please select a category", value: "" },
    { key: "Kihon", value: `Kihon` },
    { key: "Kihon Kumite", value: "Kihon Kumite" },
    { key: "Shobu Kumite", value: "Shobu Kumite" },
    { key: "Kata", value: "Kata" },
  ];
  // Dropdown options for grade
  let dropdownOptions = [];

  if (level === "Junior Level Only") {
    dropdownOptions = [
      { key: "Please select a grade", value: "" },
      { key: "16th kyu", value: 16 },
      { key: "15th kyu", value: 15 },
      { key: "14th kyu", value: 14 },
      { key: "13th kyu", value: 13 },
      { key: "12th kyu", value: 12 },
      { key: "11th kyu", value: 11 },
      { key: "10th kyu", value: 10 },
    ];
  } else if (level === "Novice Level Only") {
    dropdownOptions = [
      { key: "Please select a grade", value: "" },
      { key: "9th kyu", value: 9 },
      { key: "8th kyu", value: 8 },
      { key: "7th kyu", value: 7 },
      { key: "6th kyu", value: 6 },
    ];
  } else if (level === "Intermediate Level Only") {
    dropdownOptions = [
      { key: "Please select a grade", value: "" },
      { key: "5th kyu", value: 5 },
      { key: "4th kyu", value: 4 },
      { key: "3rd kyu", value: 3 },
      { key: "2nd kyu", value: 2 },
      { key: "1st kyu", value: 1 },
    ];
  } else if (level === "Advanced Level Only") {
    dropdownOptions = [
      { key: "Please select a grade", value: "" },
      { key: "1st dan", value: -1 },
      { key: "2nd dan", value: -2 },
    ];
  } else {
    dropdownOptions = [
      { key: "Please select a grade", value: "" },
      { key: "16th kyu", value: 16 },
      { key: "15th kyu", value: 15 },
      { key: "14th kyu", value: 14 },
      { key: "13th kyu", value: 13 },
      { key: "12th kyu", value: 12 },
      { key: "11th kyu", value: 11 },
      { key: "10th kyu", value: 10 },
      { key: "9th kyu", value: 9 },
      { key: "8th kyu", value: 8 },
      { key: "7th kyu", value: 7 },
      { key: "6th kyu", value: 6 },
      { key: "5th kyu", value: 5 },
      { key: "4th kyu", value: 4 },
      { key: "3rd kyu", value: 3 },
      { key: "2nd kyu", value: 2 },
      { key: "1st kyu", value: 1 },
      { key: "1st dan", value: -1 },
      { key: "2nd dan", value: -2 },
    ];
  }

  // Grade Options
  const gradeOptions = [
    { key: "15th kyu", value: "15th kyu" },
    { key: "14th kyu", value: "14th kyu" },
    { key: "13th kyu", value: "13th kyu" },
    { key: "12th kyu", value: "12th kyu" },
    { key: "11th kyu", value: "11th kyu" },
    { key: "10th kyu", value: "10th kyu" },
    { key: "9th kyu", value: "9th kyu" },
    { key: "8th kyu", value: "8th kyu" },
    { key: "7th kyu", value: "7th kyu" },
    { key: "6th kyu", value: "6th kyu" },
    { key: "5th kyu", value: "5th kyu" },
    { key: "4th kyu", value: "4th kyu" },
    { key: "3rd kyu", value: "3rd kyu" },
    { key: "2nd kyu", value: "2nd kyu" },
    { key: "1st kyu", value: "1st kyu" },
    { key: "1st dan", value: "1st dan" },
    { key: "2nd dan", value: "2nd dan" },
  ];

  const validationSchema = Yup.object({
    grade: Yup.array().required("Required"),
    title: Yup.string().required("Required"),
    img: Yup.string().required("Required"),
    video: Yup.string().required("Required"),
    soundFile: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
  });

  let editInitialValues = {};

  if (trainingVideo) {
    initialValues = {
      grade: trainingVideo.grade,
      title: trainingVideo.title,
      img: trainingVideo.img,
      video: trainingVideo.video,
      soundFile: trainingVideo.soundFile,
      category: trainingVideo.category,
    };
  }

  const gradeHandler = (e) => {
    setGrade(e.target.value);
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
      {trainingVideoError && (
        <Message variant="danger">{trainingVideoError}</Message>
      )}

      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Syllabus
          </h3>
          <Row className="text-center">
            <Col>
              <Card>
                <Card.Img variant="top" src={juniorImg} />
                <Card.Body>
                  <Card.Title>Juniors</Card.Title>
                  <Button onClick={() => setLevel("Junior Level Only")}>
                    View Syllabus
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Img variant="top" src={noviceImg} />
                <Card.Body>
                  <Card.Title>Novice</Card.Title>
                  <Button onClick={() => setLevel("Novice Level Only")}>
                    View Syllabus
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card>
                <Card.Img variant="top" src={intermediateImg} />
                <Card.Body>
                  <Card.Title>Intermediate</Card.Title>
                  <Button onClick={() => setLevel("Intermediate Level Only")}>
                    View Syllabus
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card>
                <Card.Img variant="top" src={advancedImg} />
                <Card.Body>
                  <Card.Title>Advanced</Card.Title>
                  <Button onClick={() => setLevel("Advanced Level Only")}>
                    View Syllabus
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="d-flex align-items-center justify-content-around my-3">
            <div className="text-center p-2 bg-primary">
              <button
                className="btn-default btn"
                onClick={() => {
                  setCreateModal(true);
                }}
              >
                <i className="fas fa-plus"></i> Create Training Video
              </button>
            </div>
            <div className="text-center d-flex align-items-center bg-primary p-1">
              <h5 className="text-center my-3 text-warning">
                {level} (
                <a
                  onClick={() => {
                    setLevel("All Levels");
                    setGrade("All Grades");
                  }}
                  className="text-link"
                >
                  reset
                </a>
                )
              </h5>

              <FormControl
                as="select"
                style={{ maxWidth: "200px" }}
                className="mx-auto"
                onChange={gradeHandler}
              >
                {dropdownOptions.map((option) => (
                  <option value={option.value}>{option.key}</option>
                ))}
              </FormControl>
            </div>
          </div>

          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center"
          >
            <thead>
              <tr className="text-center">
                <th>Grade Level</th>
                <th>Name</th>
                <th>Category</th>
                <th>View Video</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {trainingVideos.map((trainingVideo) => (
                <tr key={trainingVideo._id}>
                  <td className="align-middle">
                    {trainingVideo.grade.map((grade) => (
                      <>
                        <small>{grade}, </small>
                      </>
                    ))}
                  </td>
                  <td className="align-middle">{trainingVideo.title}</td>
                  <td className="align-middle">{trainingVideo.category}</td>
                  <td>
                    <Link to={`/trainingVideos/${trainingVideo._id}`}>
                      <Button variant="light" className="btn btn-block p-1 m-1">
                        <i
                          className="fa-solid fa-eye"
                          style={{ color: "orange" }}
                        ></i>{" "}
                        <br />
                        View
                      </Button>
                    </Link>
                  </td>
                  <td>
                    <Button
                      variant="light"
                      className="btn btn-block px-3 py-1 m-1"
                      onClick={async () => {
                        setUpdateId(trainingVideo._id);

                        await dispatch(listTrainingVideo(trainingVideo._id));

                        await setEditModal(true);
                      }}
                    >
                      <i
                        className="fa-solid fa-pen-to-square"
                        style={{ color: "green" }}
                      ></i>{" "}
                      <br />
                      Edit
                    </Button>
                  </td>
                  <td className="align-middle">
                    <Button
                      variant="light"
                      className="btn btn-block p-1 m-1 text-danger"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(trainingVideo._id);
                      }}
                    >
                      <i className="fas fa-trash" style={{ color: "red" }}></i>{" "}
                      <br />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Training Video?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the training video from the
          database and the details will be irretrievable. <br /> Are you sure?
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
          <Modal.Title>Create a new Training Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createTrainingVideoHandler}
          >
            {({ values }) => (
              <Form>
                <FormikControl
                  control="input"
                  label="title"
                  type="text"
                  name="title"
                  placeholder="Training Video Title"
                />

                <FormikControl
                  control="input"
                  label="link to image"
                  type="text"
                  name="img"
                  placeholder="Image ID number"
                />
                <FormikControl
                  control="input"
                  label="link to video"
                  type="text"
                  name="video"
                  placeholder="Video Link"
                />
                <FormikControl
                  control="input"
                  label="link to sound"
                  type="text"
                  name="soundFile"
                  placeholder="Sound ID number"
                />

                <FormikControl
                  control="select"
                  label="Category"
                  name="category"
                  options={categoryOptions}
                />

                <FormikControl
                  control="checkbox"
                  label="Grade Level"
                  name="grade"
                  options={gradeOptions}
                />

                <button type="submit" className="btn btn-block btn-default">
                  Create
                </button>
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

      {/* <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
          setEditDescription(false);
        }}
      >
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Edit event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {event && (
            <>
              <img src={`${image}`} alt="" />
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
                <FormikControl
                  control="input"
                  label="Title"
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

                <h3>Description</h3>

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
                      onClick={() => setEditDescription(true)}
                      className="mb-4 btn-sm"
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

                <Button type="submit" className="btn-block btn-warning">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
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
      </Modal> */}
    </Container>
  );
};

export default ListSyllabusScreen;
