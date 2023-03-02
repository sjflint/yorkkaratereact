import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route } from "react-router-dom";
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
import * as Yup from "yup";
import FormikControl from "../components/FormComponents/FormikControl";
import { Formik, Form } from "formik";
import UploadVideo from "../components/UploadVideo";
import uploading from "../img/uploading(1).gif";
import UploadImage from "../components/uploadImage";
import UploadFile from "../components/UploadFile";
import SearchBox from "../components/SearchBox";
import TrainingVideoPaginate from "../components/TrainingVideoPaginate";
import { UPLOAD_VIDEO_CLEAR } from "../constants/uploadFileConstants";
import { UPLOAD_IMG_CLEAR } from "../constants/uploadFileConstants";
import { UPLOAD_FILE_CLEAR } from "../constants/uploadFileConstants";

const ListSyllabusScreen = ({ history, match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [newVideo, setNewVideo] = useState();
  const [image, setImage] = useState();
  const [file, setFile] = useState();

  const singleImageData = (singleImage) => {
    setImage(singleImage);
  };

  const singleVideoData = (singleVideo) => {
    setNewVideo(singleVideo);
  };

  const singleFileData = (singleFile) => {
    setFile(singleFile);
  };

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const trainingVideoList = useSelector((state) => state.trainingVideoList);
  const { loading, error, trainingVideos, pages, page } = trainingVideoList;

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
      history.push("/login?redirect=instructor/editsyllabus");
    } else if (!memberInfo.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listTrainingVideos(pageNumber, keyword));
    }
  }, [
    dispatch,
    history,
    memberInfo,
    successDelete,
    successCreate,
    successUpdate,
    member.isInstructor,
    pageNumber,
    keyword,
  ]);

  const deleteHandler = async () => {
    dispatch(deleteTrainingVideo(deleteId));
    setDeleteModal(false);
  };

  const createTrainingVideoHandler = (values) => {
    values.video = newVideo;
    values.img = image;
    values.soundFile = file;
    dispatch(createTrainingVideo(values));
    setCreateModal(false);
  };

  const editTrainingVideoHandler = async (values) => {
    values.id = updateId;
    values.video = newVideo;
    values.img = image;
    values.soundFile = file;
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

  // Grade Options
  const gradeOptions = [
    { key: "15th kyu", value: "15" },
    { key: "14th kyu", value: "14" },
    { key: "13th kyu", value: "13" },
    { key: "12th kyu", value: "12" },
    { key: "11th kyu", value: "11" },
    { key: "10th kyu", value: "10" },
    { key: "9th kyu", value: "9" },
    { key: "8th kyu", value: "8" },
    { key: "7th kyu", value: "7" },
    { key: "6th kyu", value: "6" },
    { key: "5th kyu", value: "5" },
    { key: "4th kyu", value: "4" },
    { key: "3rd kyu", value: "3" },
    { key: "2nd kyu", value: "2" },
    { key: "1st kyu", value: "1" },
    { key: "1st dan", value: "-1" },
    { key: "2nd dan", value: "-2" },
    { key: "3rd dan", value: "-3" },
    { key: "4th dan", value: "-4" },
  ];

  const validationSchema = Yup.object({
    grade: Yup.array().required("Required"),
    title: Yup.string().required("Required"),
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

  const marker = (num) => {
    return num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i>
        </Link>

        <button
          className="btn-outline-secondary py-0 btn"
          onClick={() => {
            setCreateModal(true);
            dispatch({ type: UPLOAD_VIDEO_CLEAR });
            dispatch({ type: UPLOAD_IMG_CLEAR });
            dispatch({ type: UPLOAD_FILE_CLEAR });
          }}
        >
          <i className="fas fa-plus"></i> Create Video
        </button>
      </div>

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
          <h3 className="text-center border-bottom border-warning mb-3">
            Library of Techniques and Kata
          </h3>

          <Route
            render={({ history }) => (
              <SearchBox
                history={history}
                path={"/instructor/editsyllabus/"}
                placeholder="videos"
              />
            )}
          />

          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center mt-3"
          >
            <thead className="align-middle">
              <tr className="text-center">
                <th className="d-flex flex-column">
                  <>Grade Level </>
                </th>
                <th>Name</th>
                <th>All</th>
                <th>View</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {trainingVideos.trainingVideos &&
                trainingVideos.trainingVideos.map((trainingVideo) => (
                  <>
                    <tr key={trainingVideo._id}>
                      {Math.min(...trainingVideo.grade) > 0 ? (
                        <td>
                          {`${
                            Math.max(...trainingVideo.grade) +
                            marker(Math.max(...trainingVideo.grade))
                          } kyu - ${
                            Math.min(...trainingVideo.grade) +
                            marker(Math.min(...trainingVideo.grade))
                          } kyu`}
                        </td>
                      ) : Math.min(...trainingVideo.grade) < 0 &&
                        Math.max(...trainingVideo.grade) < 0 ? (
                        <td>
                          {`${
                            Math.max(...trainingVideo.grade) * -1 +
                            marker(Math.max(...trainingVideo.grade) * -1)
                          } dan - ${
                            Math.min(...trainingVideo.grade) * -1 +
                            marker(Math.min(...trainingVideo.grade) * -1)
                          } dan`}
                        </td>
                      ) : (
                        <td>
                          {`${
                            Math.max(...trainingVideo.grade) +
                            marker(Math.max(...trainingVideo.grade))
                          } kyu - ${
                            Math.min(...trainingVideo.grade) * -1 +
                            marker(Math.min(...trainingVideo.grade) * -1)
                          } dan`}
                        </td>
                      )}

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
                            await dispatch(
                              listTrainingVideo(trainingVideo._id)
                            );
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
                  </>
                ))}
            </tbody>
          </Table>
        </>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TrainingVideoPaginate pages={pages} page={page} editList={true} />
      </div>

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

      <Modal
        show={createModal}
        onHide={() => {
          setCreateModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">
            Create a new Training Video
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadVideo singleVideoData={singleVideoData} />
          <p className="text-center">Max video size: 400MB</p>
          <UploadImage
            type="VideoPoster"
            singleImageData={singleImageData}
            buttonText="Add video Poster/Image"
          />
          <p className="text-center">
            Recommended aspect ratio: 16:9. Image will be cropped to fit
          </p>
          <UploadFile
            singleFileData={singleFileData}
            buttonText="Add sound file"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createTrainingVideoHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="title"
                    type="text"
                    name="title"
                    placeholder="Training Video Title"
                  />
                  <small>
                    Please note: The title must be unique and identify the
                    training video
                  </small>
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Category"
                    name="category"
                    options={categoryOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="checkbox"
                    label="Grade Level"
                    name="grade"
                    options={gradeOptions}
                  />
                </div>
                {!newVideo || !image || !file ? (
                  <Button type="submit" className="btn-default w-100" disabled>
                    Please upload a video, image and a file
                  </Button>
                ) : newVideo === "loading" ? (
                  <Button className="btn-light w-100 p-0">
                    <img src={uploading} alt="" className="w-25" />
                  </Button>
                ) : (
                  <Button type="submit" className="btn-default w-100">
                    Create
                  </Button>
                )}
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
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Edit Training Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadVideo
            id={video._id}
            vid={video.video}
            singleVideoData={singleVideoData}
          />
          <UploadImage
            id={video._id}
            img={video.img}
            type="VideoPoster"
            singleImageData={singleImageData}
            buttonText="Add video Poster/Image"
          />
          <p className="text-center">
            Recommended aspect ratio: 16:9. Image will be cropped to fit
          </p>
          <UploadFile
            id={video._id}
            singleFileData={singleFileData}
            buttonText="Change audio file"
            currFile={video.soundFile}
          />
          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editTrainingVideoHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="title"
                    type="text"
                    name="title"
                    placeholder="Training Video Title"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Category"
                    name="category"
                    options={categoryOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="checkbox"
                    label="Grade Level"
                    name="grade"
                    options={gradeOptions}
                  />
                </div>
                <Button type="submit" className="btn-default w-100">
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ListSyllabusScreen;
