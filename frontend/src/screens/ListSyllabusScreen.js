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
  ListGroup,
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
import {
  juniorBeginner,
  juniorWhite,
  juniorOrange,
  juniorAdvanced,
  noviceL1,
  noviceL2,
  intermediateL1,
  intermediateL2,
  advancedL1,
  advancedL2,
} from "../clubVariables/gradeLevelSplit";

const ListSyllabusScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [syllabusLevel, setSyllabusLevel] = useState(juniorBeginner);
  const [syllabusModal, setSyllabusModal] = useState(false);
  const [grade, setGrade] = useState("");
  const [videoModal, setVideoModal] = useState(false);
  const [videoModalId, setVideoModalId] = useState(false);
  const [category, setCategory] = useState("All");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const trainingVideoList = useSelector((state) => state.trainingVideoList);
  const { loading, error, trainingVideos } = trainingVideoList;

  const displayTrainingVideo = useSelector(
    (state) => state.displayTrainingVideo
  );
  const { error: trainingVideoError, video } = displayTrainingVideo;

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
    if (!memberInfo) {
      history.push("/login");
    } else if (!member.isInstructor) {
      history.push("/profile");
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
    member.isInstructor,
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
  const dropdownOptions = [
    { key: "Show All Grades", value: "" },
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

  if (video) {
    editInitialValues = {
      grade: video.grade,
      title: video.title,
      img: video.img,
      video: video.video,
      soundFile: video.soundFile,
      category: video.category,
    };
  }

  // filter by a single grade
  let filteredVideos;
  if (grade !== "") {
    filteredVideos = trainingVideos.filter((video) =>
      video.grade.includes(grade)
    );
  } else {
    filteredVideos = trainingVideos;
  }

  // filter by category after grade filter
  if (category !== "All") {
    filteredVideos = filteredVideos.filter(
      (video) => video.category === category
    );
  }

  // filter by level
  let syllabusVideos = trainingVideos;
  let arrayOfSyllabusVideos = [];
  syllabusLevel.map((grade) => {
    syllabusVideos = trainingVideos.filter((video) =>
      video.grade.includes(grade)
    );
    return (arrayOfSyllabusVideos = syllabusVideos.concat(
      arrayOfSyllabusVideos
    ));
  });

  let newSyllabusVideos = new Set(arrayOfSyllabusVideos);
  newSyllabusVideos = [...newSyllabusVideos];

  // filter by kata/kihon kumite/shobu kumite/kata
  let kihonVideos = [];
  let kihonKumiteVideos = [];
  let shobuKumiteVideos = [];
  let kataVideos = [];
  newSyllabusVideos.map((video) => {
    if (video.category === "Kihon") {
      return kihonVideos.push(video);
    }
    if (video.category === "Kihon Kumite") {
      return kihonKumiteVideos.push(video);
    }
    if (video.category === "Shobu Kumite") {
      return shobuKumiteVideos.push(video);
    }
    if (video.category === "Kata") {
      return kataVideos.push(video);
    } else {
      return null;
    }
  });

  return (
    <Container fluid="lg">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-dark" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>

        <button
          className="btn-dark btn"
          onClick={() => {
            setCreateModal(true);
          }}
        >
          <i className="fas fa-plus"></i> Create Training Video
        </button>
      </div>
      <h3 className="text-center border-bottom border-warning pb-1 mb-2">
        Syllabus
      </h3>
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
          <Row className="text-center no-gutters mb-2">
            <Col xs={6} sm={3}>
              <Card className="h-100">
                <Card.Img variant="top" src={juniorImg} />
                <Card.Body>
                  <Card.Title>Junior</Card.Title>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(juniorBeginner);
                      setSyllabusModal(true);
                    }}
                  >
                    15th kyu
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(juniorWhite);
                      setSyllabusModal(true);
                    }}
                  >
                    14th & 13th kyu
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(juniorOrange);
                      setSyllabusModal(true);
                    }}
                  >
                    12th & 11th kyu
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(juniorAdvanced);
                      setSyllabusModal(true);
                    }}
                  >
                    10th kyu
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="h-100">
                <Card.Img variant="top" src={noviceImg} />
                <Card.Body>
                  <Card.Title>Novice</Card.Title>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(noviceL1);
                      setSyllabusModal(true);
                    }}
                  >
                    Novice - Level 1
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(noviceL2);
                      setSyllabusModal(true);
                    }}
                  >
                    Novice - Level 2
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} sm={3}>
              <Card className="h-100">
                <Card.Img variant="top" src={intermediateImg} />
                <Card.Body>
                  <Card.Title>Intermediate</Card.Title>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(intermediateL1);
                      setSyllabusModal(true);
                    }}
                  >
                    Intermediate Level 1
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(intermediateL2);
                      setSyllabusModal(true);
                    }}
                  >
                    Intermediate Level 2
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6} sm={3}>
              <Card className="h-100">
                <Card.Img variant="top" src={advancedImg} />
                <Card.Body>
                  <Card.Title>Advanced</Card.Title>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(advancedL1);
                      setSyllabusModal(true);
                    }}
                  >
                    Advanced Level 1
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-sm w-100 mb-1"
                    onClick={() => {
                      setSyllabusLevel(advancedL2);
                      setSyllabusModal(true);
                    }}
                  >
                    Advanced Level 2
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h3 className="text-center border-bottom border-warning pb-1 mt-5 mb-2">
            Library of Techniques and Kata
          </h3>

          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center"
          >
            <thead className="align-middle">
              <tr className="text-center">
                <th className="d-flex flex-column">
                  <>Grade Level </>
                  <FormControl
                    as="select"
                    size="sm"
                    style={{ maxWidth: "200px" }}
                    className="mt-1"
                    onChange={(e) => setGrade(e.target.value)}
                  >
                    {dropdownOptions.map((option) => (
                      <option value={option.value} key={option.key}>
                        {option.key}
                      </option>
                    ))}
                  </FormControl>
                </th>
                <th>Name</th>
                {category === "All" ? (
                  <th className="pointer" onClick={() => setCategory("Kihon")}>
                    ({category}) <i className="fas fa-sort"></i>
                  </th>
                ) : category === "Kihon" ? (
                  <th
                    className="pointer"
                    onClick={() => setCategory("Kihon Kumite")}
                  >
                    ({category}) <i className="fas fa-sort"></i>
                  </th>
                ) : category === "Kihon Kumite" ? (
                  <th className="pointer" onClick={() => setCategory("Kata")}>
                    ({category}) <i className="fas fa-sort"></i>
                  </th>
                ) : category === "Kata" ? (
                  <th
                    className="pointer"
                    onClick={() => setCategory("Shobu Kumite")}
                  >
                    ({category}) <i className="fas fa-sort"></i>
                  </th>
                ) : (
                  <th className="pointer" onClick={() => setCategory("All")}>
                    ({category}) <i className="fas fa-sort"></i>
                  </th>
                )}

                <th>View</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {filteredVideos.map((trainingVideo) => (
                <tr key={trainingVideo._id}>
                  <td>
                    {`${
                      trainingVideo.grade[trainingVideo.grade.length - 1]
                    } - ${trainingVideo.grade[0]}`}
                  </td>
                  <td className="max-width-200">{trainingVideo.title}</td>
                  <td>{trainingVideo.category}</td>
                  <td>
                    <a href={`/trainingVideos/${trainingVideo._id}`}>
                      <Button variant="warning" className="btn btn-sm">
                        <i className="fa-solid fa-eye"></i>{" "}
                      </Button>
                    </a>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      className="btn btn-sm"
                      onClick={async () => {
                        setUpdateId(trainingVideo._id);
                        await dispatch(listTrainingVideo(trainingVideo._id));
                        await setEditModal(true);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>{" "}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn btn-sm"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(trainingVideo._id);
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
            Permanently Delete Training Video?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the training video from the
          database and the details will be irretrievable. <br /> Are you sure?
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
          <Modal.Title className="text-white">
            Create a new Training Video
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createTrainingVideoHandler}
          >
            {({ values }) => (
              <Form>
                <small>
                  Please note: The title must be unique and identify the
                  training video
                </small>
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

                <Button type="submit" className="btn-default w-100">
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="text-white">Edit Training Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editTrainingVideoHandler}
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

                <Button type="submit" className="btn-default w-100">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={syllabusModal} onHide={() => setSyllabusModal(false)}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Syllabus</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {kihonVideos.length !== 0 && <h5 className="text-center">Kihon</h5>}
          <ListGroup>
            {kihonVideos &&
              kihonVideos.map((video) => (
                <ListGroup.Item
                  variant="light"
                  className="d-flex justify-content-between align-items-start text-dark"
                  key={video._id}
                >
                  {video.title}
                  <button
                    className="btn-default"
                    onClick={() => {
                      setVideoModal(true);
                      setVideoModalId(video.video);
                    }}
                  >
                    View Video
                  </button>
                </ListGroup.Item>
              ))}
          </ListGroup>

          {kihonKumiteVideos.length !== 0 && (
            <h5 className="mt-3 text-center">Kihon Kumite</h5>
          )}
          <ListGroup>
            {kihonKumiteVideos &&
              kihonKumiteVideos.map((video) => (
                <div key={video._id}>
                  {video.category === "Kihon Kumite" && (
                    <ListGroup.Item
                      variant="light"
                      className="text-dark d-flex justify-content-between align-items-start"
                    >
                      {video.title}
                      <button
                        className="btn-default"
                        onClick={() => {
                          setVideoModal(true);
                          setVideoModalId(video.video);
                        }}
                      >
                        View Video
                      </button>
                    </ListGroup.Item>
                  )}
                </div>
              ))}
          </ListGroup>

          {shobuKumiteVideos.length !== 0 && (
            <h5 className="mt-3 text-center">Shobu Kumite</h5>
          )}
          <ListGroup>
            {shobuKumiteVideos &&
              shobuKumiteVideos.map((video) => (
                <div key={video._id}>
                  {video.category === "Shobu Kumite" && (
                    <ListGroup.Item
                      variant="light"
                      className="text-dark d-flex justify-content-between align-items-start"
                    >
                      {video.title}
                      <button
                        className="btn-default"
                        onClick={() => {
                          setVideoModal(true);
                          setVideoModalId(video.video);
                        }}
                      >
                        View Video
                      </button>
                    </ListGroup.Item>
                  )}
                </div>
              ))}
          </ListGroup>

          {kataVideos.length !== 0 && (
            <h5 className="mt-3 text-center">Kata</h5>
          )}
          <ListGroup>
            {kataVideos &&
              kataVideos.map((video) => (
                <div key={video._id}>
                  {video.category === "Kata" && (
                    <ListGroup.Item
                      variant="light"
                      className="text-dark d-flex justify-content-between align-items-start"
                    >
                      {video.title}
                      <button
                        className="btn-default"
                        onClick={() => {
                          setVideoModal(true);
                          setVideoModalId(video.video);
                        }}
                      >
                        View Video
                      </button>
                    </ListGroup.Item>
                  )}
                </div>
              ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setSyllabusModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={videoModal} onHide={() => setVideoModal(false)}>
        <Modal.Header closeButton className="bg-light"></Modal.Header>
        <div>
          <iframe
            src={videoModalId}
            width="100%"
            height="400"
            allow="autoplay"
            title={videoModalId}
          ></iframe>
        </div>
      </Modal>
    </Container>
  );
};

export default ListSyllabusScreen;