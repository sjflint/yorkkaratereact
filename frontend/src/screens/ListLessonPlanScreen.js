import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listLessonPlans,
  deleteLessonPlan,
  createLessonPlan,
  listLessonPlan,
  updateLessonPlan,
} from "../actions/lessonPlanActions";
import { LESSON_PLAN_CREATE_RESET } from "../constants/lessonPlanConstants";
import * as Yup from "yup";
import FormikControl from "../components/FormComponents/FormikControl";
import { Formik, Form } from "formik";
import { listTrainingVideos } from "../actions/TrainingVideoActions";
import {
  Button,
  Col,
  Container,
  FormControl,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import {
  junior,
  novice,
  intermediate,
  advanced,
} from "../clubVariables/gradeLevelSplit";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ListLessonPlanScreen = ({ history }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [syllabusLevel, setSyllabusLevel] = useState(junior.join(","));
  const [volume, setVolume] = useState("stop");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const lessonPlanList = useSelector((state) => state.lessonPlanList);
  const { loading, error, lessonPlans } = lessonPlanList;

  const displayLessonPlan = useSelector((state) => state.displayLessonPlan);
  const { error: lessonPlanError, lessonPlan } = displayLessonPlan;

  const lessonPlanDelete = useSelector((state) => state.lessonPlanDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = lessonPlanDelete;

  const lessonPlanUpdate = useSelector((state) => state.lessonPlanUpdate);
  const { error: errorUpdate, success: successUpdate } = lessonPlanUpdate;

  const lessonPlanCreate = useSelector((state) => state.lessonPlanCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = lessonPlanCreate;

  const trainingVideoList = useSelector((state) => state.trainingVideoList);
  const { trainingVideos } = trainingVideoList;

  useEffect(() => {
    dispatch({ type: LESSON_PLAN_CREATE_RESET });
    if (!memberInfo) {
      history.push("/login");
    } else if (!member.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listLessonPlans());
      dispatch(listTrainingVideos());
    }
  }, [
    dispatch,
    history,
    memberInfo,
    member,
    successDelete,
    successCreate,
    successUpdate,
  ]);

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
  });

  const deleteHandler = async () => {
    dispatch(deleteLessonPlan(deleteId));
    setDeleteModal(false);
  };

  const createLessonPlanHandler = (values) => {
    dispatch(createLessonPlan(values));
    setCreateModal(false);
  };

  const editLessonPlanHandler = async (values) => {
    values.id = updateId;
    dispatch(updateLessonPlan(values));
    setEditModal(false);
  };

  // Form details (inital values, form validation)
  let filteredKihonVideos = [];
  let filteredKihonKumiteVideos = [];
  let filteredShobuKumiteVideos = [];
  let filteredKataVideos = [];

  let initialValues = {
    title: "",
    description: "",
    kihon: [],
    kihonKumite: [],
    shobuKumite: [],
    kata: [],
  };

  let editInitialValues;
  if (lessonPlan) {
    editInitialValues = {
      title: lessonPlan.title,
      description: lessonPlan.description,
      kihon: lessonPlan.kihon,
      kihonKumite: lessonPlan.kihonKumite,
      shobuKumite: lessonPlan.shobuKumite,
      kata: lessonPlan.kata,
    };
  }

  // Dropdown options for grade
  const dropdownSyllabusLevelOptions = [
    { key: "Juniors", value: junior },
    { key: "Novice", value: novice },
    { key: "Intermediate", value: intermediate },
    { key: "Advanced", value: advanced },
  ];

  // dropdown options for kihon
  const kihonDropdownOptions = filteredKihonVideos;
  // dropdown options for kihon
  const kihonKumiteDropdownOptions = filteredKihonKumiteVideos;
  // dropdown options for kihon
  const shobuKumiteDropdownOptions = filteredShobuKumiteVideos;
  // dropdown options for kihon
  const kataDropdownOptions = filteredKataVideos;

  // filter videos by grade and category, based on class level input from user
  let syllabusVideos = trainingVideos;
  let arrayOfSyllabusVideos = [];
  if (syllabusLevel.length !== 0) {
    syllabusLevel.split(",").map((grade) => {
      syllabusVideos = trainingVideos.filter((video) =>
        video.grade.includes(grade)
      );
      return (arrayOfSyllabusVideos = syllabusVideos.concat(
        arrayOfSyllabusVideos
      ));
    });
  }

  let newSyllabusVideos = new Set(arrayOfSyllabusVideos);
  newSyllabusVideos = [...newSyllabusVideos];

  if (newSyllabusVideos.length !== 0) {
    newSyllabusVideos.map((video) => {
      if (video.category === "Kihon") {
        return filteredKihonVideos.push({ key: video.title, value: video._id });
      } else {
        return null;
      }
    });

    newSyllabusVideos.map((video) => {
      if (video.category === "Kihon Kumite") {
        return filteredKihonKumiteVideos.push({
          key: video.title,
          value: video._id,
        });
      } else {
        return null;
      }
    });
    newSyllabusVideos.map((video) => {
      if (video.category === "Shobu Kumite") {
        return filteredShobuKumiteVideos.push({
          key: video.title,
          value: video._id,
        });
      } else {
        return null;
      }
    });
    newSyllabusVideos.map((video) => {
      if (video.category === "Kata") {
        return filteredKataVideos.push({ key: video.title, value: video._id });
      } else {
        return null;
      }
    });
  }

  const playAudio = () => {
    const audioEl = document.getElementById("soundFile");
    setVolume("play");

    audioEl.play();
  };

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
          <i className="fas fa-plus"></i> Create Lesson Plan
        </button>
      </div>
      <h3 className="text-center border-bottom border-warning pb-1 mb-2">
        Lesson Plans
      </h3>
      {loadingDelete && <Loader variant="warning" />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader variant="warning" />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {lessonPlanError && <Message variant="danger">{lessonPlanError}</Message>}

      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm text-center"
        >
          <thead>
            <tr className="text-center">
              <th className="align-middle">Title</th>
              <th className="align-middle">Description</th>
              <th className="align-middle">View</th>
              <th className="align-middle">Edit</th>
              <th className="align-middle">Delete</th>
            </tr>
          </thead>
          <tbody>
            {lessonPlans &&
              lessonPlans.map((lessonPlan) => (
                <tr key={lessonPlan._id} className="align-middle">
                  <td>{lessonPlan.title}</td>
                  <td>{lessonPlan.description}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="btn-sm"
                      onClick={async () => {
                        setUpdateId(lessonPlan._id);
                        await dispatch(listLessonPlan(lessonPlan._id));
                        await setViewModal(true);
                      }}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      className="btn-sm"
                      onClick={async () => {
                        setUpdateId(lessonPlan._id);
                        await dispatch(listLessonPlan(lessonPlan._id));
                        await setEditModal(true);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(lessonPlan._id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {/* Create modal / edit modal / view modal / delete modal */}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            Permanently Delete Lesson PLan?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the lesson plan from the database
          and the details will be irretrievable. <br /> Are you sure?
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
            Create a new lesson plan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createLessonPlanHandler}
          >
            {({ values }) => (
              <Form>
                <div className="mb-2 pb-2 border-warning border-bottom">
                  <label>Grade Category</label>
                  <FormControl
                    as="select"
                    style={{ maxWidth: "200px" }}
                    onChange={(e) => {
                      filteredKihonVideos = [];
                      initialValues.kihonKumite = [];
                      initialValues.shobuKumite = [];
                      initialValues.kata = [];
                      setSyllabusLevel(e.target.value);
                    }}
                  >
                    {dropdownSyllabusLevelOptions.map((option) => (
                      <option value={option.value}>{option.key}</option>
                    ))}
                  </FormControl>
                </div>
                <FormikControl
                  control="input"
                  label="Title"
                  type="text"
                  name="title"
                  placeholder="Lesson Plan Title"
                />

                <FormikControl
                  control="input"
                  label="Description"
                  type="text"
                  name="description"
                  placeholder="Description"
                />

                {kihonDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Kihon Videos"
                    name="kihon"
                    options={kihonDropdownOptions}
                  />
                )}
                {kihonKumiteDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Kihon Kumite Videos"
                    name="kihonKumite"
                    options={kihonKumiteDropdownOptions}
                  />
                )}
                {kataDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Kata Videos"
                    name="kata"
                    options={kataDropdownOptions}
                  />
                )}
                {shobuKumiteDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Shobu Kumite Videos"
                    name="shobuKumite"
                    options={shobuKumiteDropdownOptions}
                  />
                )}

                <Button type="submit" className="w-100 btn-default my-3">
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton className="bg-success">
          <Modal.Title className="text-white">Edit lesson plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editLessonPlanHandler}
          >
            {({ values }) => (
              <Form>
                <div className="mb-2 pb-2 border-warning border-bottom">
                  <label>Grade Category</label>
                  <FormControl
                    as="select"
                    style={{ maxWidth: "200px" }}
                    onChange={(e) => {
                      filteredKihonVideos = [];
                      initialValues.kihonKumite = [];
                      initialValues.shobuKumite = [];
                      initialValues.kata = [];
                      setSyllabusLevel(e.target.value);
                    }}
                  >
                    {dropdownSyllabusLevelOptions.map((option) => (
                      <option value={option.value} key={option.key}>
                        {option.key}
                      </option>
                    ))}
                  </FormControl>
                </div>
                <FormikControl
                  control="input"
                  label="Title"
                  type="text"
                  name="title"
                  placeholder="Lesson Plan Title"
                />

                <FormikControl
                  control="input"
                  label="Description"
                  type="text"
                  name="description"
                  placeholder="Description"
                />

                {kihonDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Kihon Videos"
                    name="kihon"
                    options={kihonDropdownOptions}
                  />
                )}
                {kihonKumiteDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Kihon Kumite Videos"
                    name="kihonKumite"
                    options={kihonKumiteDropdownOptions}
                  />
                )}
                {kataDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Kata Videos"
                    name="kata"
                    options={kataDropdownOptions}
                  />
                )}
                {shobuKumiteDropdownOptions.length !== 0 && (
                  <FormikControl
                    control="checkbox"
                    label="Shobu Kumite Videos"
                    name="shobuKumite"
                    options={shobuKumiteDropdownOptions}
                  />
                )}

                <Button type="submit" className="w-100 btn-default my-3">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={viewModal} size="lg" onHide={() => setViewModal(false)}>
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title className="text-white">{lessonPlan.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {lessonPlan.title && (
            <>
              {lessonPlan.kihon.length !== 0 && (
                <>
                  <h3 className="text-center text-white bg-dark p-2">Kihon</h3>
                  <Row>
                    {lessonPlan.kihon &&
                      lessonPlan.kihon.map((technique) => {
                        return trainingVideos.map((video) => {
                          if (technique === video._id) {
                            return (
                              <Col
                                sm={12}
                                lg={6}
                                className="mb-2 pb-2 border-warning border-bottom"
                                key={video._id}
                              >
                                <iframe
                                  src={video.video}
                                  width="100%"
                                  height="400"
                                  allow="autoplay"
                                  title={video._id}
                                ></iframe>

                                <div className="px-3">
                                  <h4>{video.title}</h4>
                                  <small>
                                    Category - {video.category}
                                    <br />
                                    grade level -{" "}
                                    {`${
                                      video.grade[video.grade.length - 1]
                                    } - ${video.grade[0]}`}
                                  </small>
                                </div>
                                {volume === "stop" ? (
                                  <>
                                    <div
                                      className="btn btn-light mt-2"
                                      onClick={playAudio}
                                    >
                                      <i
                                        className="fa-solid fa-play"
                                        style={{ color: "green" }}
                                      >
                                        {" "}
                                      </i>{" "}
                                      Pronunciation
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className="btn btn-light mt-2"
                                    onClick={playAudio}
                                  >
                                    <i
                                      className="fa-solid fa-volume-high"
                                      style={{ color: "green" }}
                                    >
                                      {" "}
                                    </i>{" "}
                                    Pronunciation
                                  </div>
                                )}
                                <audio
                                  src={video.soundFile}
                                  id="soundFile"
                                  onEnded={() => setVolume("stop")}
                                ></audio>
                              </Col>
                            );
                          } else {
                            return null;
                          }
                        });
                      })}
                  </Row>
                </>
              )}

              {lessonPlan.kihonKumite.length !== 0 && (
                <>
                  <h3 className="text-center text-white bg-dark p-2">
                    Kihon Kumite
                  </h3>
                  <Row>
                    {lessonPlan.kihonKumite.map((technique) => {
                      return trainingVideos.map((video) => {
                        if (technique === video._id) {
                          return (
                            <Col
                              sm={12}
                              lg={6}
                              className="mb-2 pb-2 border-warning border-bottom"
                              key={video._id}
                            >
                              <iframe
                                src={video.video}
                                width="100%"
                                height="400"
                                allow="autoplay"
                                title={video._id}
                              ></iframe>

                              <div className="px-3 py-1">
                                <h4>{video.title}</h4>
                                <small>
                                  Category - {video.category}
                                  <br />
                                  grade level -{" "}
                                  {`${video.grade[video.grade.length - 1]} - ${
                                    video.grade[0]
                                  }`}
                                </small>
                              </div>
                              {volume === "stop" ? (
                                <>
                                  <div
                                    className="btn btn-light mt-2"
                                    onClick={playAudio}
                                  >
                                    <i
                                      className="fa-solid fa-play"
                                      style={{ color: "green" }}
                                    >
                                      {" "}
                                    </i>{" "}
                                    Pronunciation
                                  </div>
                                </>
                              ) : (
                                <div
                                  className="btn btn-light mt-2"
                                  onClick={playAudio}
                                >
                                  <i
                                    className="fa-solid fa-volume-high"
                                    style={{ color: "green" }}
                                  >
                                    {" "}
                                  </i>{" "}
                                  Pronunciation
                                </div>
                              )}
                              <audio
                                src={video.soundFile}
                                id="soundFile"
                                onEnded={() => setVolume("stop")}
                              ></audio>
                            </Col>
                          );
                        } else {
                          return null;
                        }
                      });
                    })}
                  </Row>
                </>
              )}

              {lessonPlan.kata.length !== 0 && (
                <>
                  <h3 className="text-center text-white bg-dark p-2">Kata</h3>
                  <Row>
                    {lessonPlan.kata.map((technique) => {
                      return trainingVideos.map((video) => {
                        if (technique === video._id) {
                          return (
                            <Col
                              sm={12}
                              lg={6}
                              className="mb-2 pb-2 border-warning border-bottom"
                              key={video._id}
                            >
                              <iframe
                                src={video.video}
                                width="100%"
                                height="400"
                                allow="autoplay"
                                title={video._id}
                              ></iframe>

                              <div className="px-3 py-1">
                                <h4>{video.title}</h4>
                                <small>
                                  Category - {video.category}
                                  <br />
                                  grade level -{" "}
                                  {`${video.grade[video.grade.length - 1]} - ${
                                    video.grade[0]
                                  }`}
                                </small>
                              </div>
                              {volume === "stop" ? (
                                <>
                                  <div
                                    className="btn btn-light mt-2"
                                    onClick={playAudio}
                                  >
                                    <i
                                      className="fa-solid fa-play"
                                      style={{ color: "green" }}
                                    >
                                      {" "}
                                    </i>{" "}
                                    Pronunciation
                                  </div>
                                </>
                              ) : (
                                <div
                                  className="btn btn-light mt-2"
                                  onClick={playAudio}
                                >
                                  <i
                                    className="fa-solid fa-volume-high"
                                    style={{ color: "green" }}
                                  >
                                    {" "}
                                  </i>{" "}
                                  Pronunciation
                                </div>
                              )}
                              <audio
                                src={video.soundFile}
                                id="soundFile"
                                onEnded={() => setVolume("stop")}
                              ></audio>
                            </Col>
                          );
                        } else {
                          return null;
                        }
                      });
                    })}
                  </Row>
                </>
              )}
              {lessonPlan.shobuKumite.length !== 0 && (
                <>
                  <h3 className="text-center text-white bg-dark p-2">
                    Shobu Kumite
                  </h3>
                  <Row>
                    {lessonPlan.shobuKumite.map((technique) => {
                      return trainingVideos.map((video) => {
                        if (technique === video._id) {
                          return (
                            <Col
                              sm={12}
                              lg={6}
                              className="mb-2 pb-2 border-warning border-bottom"
                              key={video._id}
                            >
                              <iframe
                                src={video.video}
                                width="100%"
                                height="400"
                                allow="autoplay"
                                title={video._id}
                              ></iframe>

                              <div className="px-3 py-1">
                                <h4>{video.title}</h4>
                                <small>
                                  Category - {video.category}
                                  <br />
                                  grade level -{" "}
                                  {`${video.grade[video.grade.length - 1]} - ${
                                    video.grade[0]
                                  }`}
                                </small>
                              </div>
                              {volume === "stop" ? (
                                <>
                                  <div
                                    className="btn btn-light mt-2"
                                    onClick={playAudio}
                                  >
                                    <i
                                      className="fa-solid fa-play"
                                      style={{ color: "green" }}
                                    >
                                      {" "}
                                    </i>{" "}
                                    Pronunciation
                                  </div>
                                </>
                              ) : (
                                <div
                                  className="btn btn-light mt-2"
                                  onClick={playAudio}
                                >
                                  <i
                                    className="fa-solid fa-volume-high"
                                    style={{ color: "green" }}
                                  >
                                    {" "}
                                  </i>{" "}
                                  Pronunciation
                                </div>
                              )}
                              <audio
                                src={video.soundFile}
                                id="soundFile"
                                onEnded={() => setVolume("stop")}
                              ></audio>
                            </Col>
                          );
                        } else {
                          return null;
                        }
                      });
                    })}{" "}
                  </Row>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button className="btn-block" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListLessonPlanScreen;
