import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteArticle,
  createArticle,
  listArticles,
  updateArticle,
  listArticle,
} from "../actions/articleActions";
import { ARTICLE_CREATE_RESET } from "../constants/articleConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import * as Yup from "yup";

import { Formik, Form } from "formik";
import FormikControl from "../components/FormComponents/FormikControl";
import imagePlaceholder from "../img/defaultplaceholder.jpg";

import UploadImage from "../components/uploadImage";

const ListArticlesScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [editBody, setEditBody] = useState(false);
  const [image, setImage] = useState();
  const [multiImage, setMultiImage] = useState([]);

  const singleImageData = (singleImage) => {
    setImage(singleImage);

    const image = {
      original: singleImage,
      thumbnail: singleImage,
    };
    setMultiImage((multiImage) => [...multiImage, image]);
  };

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const articleList = useSelector((state) => state.articleList);
  const { loading, error, articles } = articleList;

  const displayArticle = useSelector((state) => state.displayArticle);
  const { error: articleError, article } = displayArticle;

  const articleDelete = useSelector((state) => state.articleDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = articleDelete;

  const articleUpdate = useSelector((state) => state.articleUpdate);
  const { error: errorUpdate, success: successUpdate } = articleUpdate;

  const articleCreate = useSelector((state) => state.articleCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = articleCreate;

  useEffect(() => {
    dispatch({ type: ARTICLE_CREATE_RESET });
    if (!memberInfo) {
      history.push("/login");
    } else if (!member.isAuthor) {
      history.push("/profile");
    } else {
      dispatch(listArticles());
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

  const deleteHandler = async () => {
    dispatch(deleteArticle(deleteId));
    setDeleteModal(false);
  };

  const createHandler = (values) => {
    values.image = image;
    values.carouselImages = multiImage;
    values.body = values.body.split("\n");
    console.log(values);
    dispatch(createArticle(values));
    setCreateModal(false);
  };

  const editHandler = async (values) => {
    values.carouselImages = multiImage;
    values.id = updateId;

    if (editBody === false) {
      values.body = article.body;
    } else {
      values.body = values.body.split("\n");
    }

    dispatch(updateArticle(values));
    setEditBody(false);
    setEditModal(false);
  };

  let initialValues;
  if (member) {
    initialValues = {
      title: "",
      leader: "",
      body: "",
      category: "",
      image: "",
      carouselImages: "",
      author: `${member.nameFirst} ${member.nameSecond}`,
      authorImg: member.profileImg,
    };
  }

  // Dropdown options for category
  const dropdownOptions = [
    { key: "Please select a category", value: "" },
    { key: "Gradings", value: `gradings` },
    { key: "Competitions & Squad", value: "Competitions & Squad" },
    { key: "Welfare & Fundraising", value: "Welfare & Fundraising" },
    { key: "Training & Courses", value: "Training & Courses" },
    { key: "Club News", value: "Club News" },
    { key: "Technical & Opinion", value: "Technical & Opinion" },
  ];

  const validationSchema = Yup.object({
    body: Yup.string().min(1500).required("Required"),
    image: Yup.string(),
    title: Yup.string().required("Required"),
    leader: Yup.string().max(150).required("Required"),
    author: Yup.string(),
    authorImg: Yup.string(),

    category: Yup.string().required("Required"),
  });

  let editInitialValues = {};
  let paragraphs;

  if (article.body !== undefined) {
    paragraphs = article.body;

    const articleBody = paragraphs.join("\n");

    editInitialValues = {
      title: article.title,
      leader: article.leader,
      body: articleBody,
      category: article.category,
      author: article.author,
      authorImg: article.authorImg,
      dateCreated: article.dateCreated,
    };
  }

  return (
    <Container fluid="lg">
      <Link className="btn btn-dark" to="/admin">
        <i className="fas fa-arrow-left"></i> Return
      </Link>
      {loadingDelete && <Loader variant="warning" />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader variant="warning" />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {articleError && <Message variant="danger">{articleError}</Message>}

      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Articles
          </h3>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Title</th>
                <th>Category</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td
                    style={{ maxWidth: "40px" }}
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      setUpdateId(article._id);

                      await dispatch(listArticle(article._id));
                      await setImage(article.image);
                      await setMultiImage(article.carouselImages);
                      await setEditModal(true);
                    }}
                  >
                    <img
                      src={`${article.image}`}
                      alt="article"
                      width="10"
                      height="40"
                    />
                  </td>
                  <td
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      setUpdateId(article._id);

                      await dispatch(listArticle(article._id));
                      await setImage(article.image);
                      await setMultiImage(article.carouselImages);
                      await setEditModal(true);
                    }}
                  >
                    {article.title}
                  </td>

                  <td className="text-center align-middle">
                    {article.category}
                  </td>
                  <td className="d-flex">
                    {
                      <>
                        <Button
                          variant="light"
                          className="btn btn-block p-0 text-danger"
                          onClick={() => {
                            setDeleteModal(true);
                            setDeleteId(article._id);
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
                            setUpdateId(article._id);

                            await dispatch(listArticle(article._id));
                            await setImage(article.image);
                            await setMultiImage(article.carouselImages);
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

          <div className="text-center">
            <button
              className="btn-default btn"
              onClick={() => {
                setCreateModal(true);
                setImage(imagePlaceholder);
              }}
            >
              <i className="fas fa-plus"></i> Write Article
            </button>
          </div>
        </>
      )}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Article?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the article from the database and
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
          <Modal.Title>Write a new article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={`${image}`} alt="" />
          <UploadImage
            singleImageData={singleImageData}
            type="Article"
            buttonText="Add Image"
          />
          <p className="text-center">
            Recommended aspect ratio: 3:2. Image will be cropped to fit
          </p>
          <div className="bg-warning p-2 mb-2">
            <h5 className="text-center text-white">
              Uploaded Images for the article
            </h5>
            <Row>
              {multiImage && multiImage.length === 0 ? (
                <Col>
                  <p className="text-center text-white">
                    No images currently uploaded
                  </p>
                </Col>
              ) : (
                multiImage.map((image, index) => (
                  <Col key={index}>
                    <img src={`${image.original}`} alt="article" />
                    <Button
                      onClick={async () => {
                        const images = multiImage;
                        images.splice(index, 1);
                        setMultiImage(images);
                        await setCreateModal(false);
                        await setCreateModal(true);
                      }}
                      className="btn btn-block btn-sm btn-secondary"
                    >
                      Remove Image
                    </Button>
                  </Col>
                ))
              )}
            </Row>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createHandler}
          >
            {({ values }) => (
              <Form>
                <FormikControl
                  control="input"
                  label="Title"
                  type="text"
                  name="title"
                  placeholder="Title of the article"
                />

                <FormikControl
                  control="input"
                  label="Leader"
                  type="text"
                  name="leader"
                  placeholder="Grab the reader's attention with something catchy!"
                />

                <FormikControl
                  control="input"
                  as="textarea"
                  label="The Article Body"
                  name="body"
                  placeholder="All the details. Try to write fluently and without being boring!"
                  rows="15"
                />

                <FormikControl
                  control="select"
                  label="Category"
                  name="category"
                  options={dropdownOptions}
                />

                <button type="submit" className="btn-block btn-default btn">
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

      <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
          setEditBody(false);
        }}
      >
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>Edit Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {article && (
            <>
              <img src={`${image}`} alt="" />
              <UploadImage
                singleImageData={singleImageData}
                type={"Article"}
                buttonText="Add another image"
              />
              <p className="text-center">
                Recommended aspect ratio: 3:2. Image will be cropped to fit
              </p>

              <div className="bg-warning p-2 mb-2">
                <h5 className="text-center text-white">
                  Uploaded Images for the article
                </h5>
                <Row>
                  {multiImage.length === 0 ? (
                    <Col>
                      <p className="text-center text-white">
                        No images currently uploaded
                      </p>
                    </Col>
                  ) : (
                    multiImage.map((image, index) => (
                      <Col key={index}>
                        <img src={`${image.original}`} alt="article" />
                        <Button
                          onClick={async () => {
                            const images = multiImage;
                            images.splice(index, 1);
                            setMultiImage(images);
                            await setEditModal(false);
                            await setEditModal(true);
                          }}
                          className="btn btn-block btn-sm btn-secondary"
                        >
                          Remove Image
                        </Button>
                      </Col>
                    ))
                  )}
                </Row>
              </div>
            </>
          )}

          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editHandler}
          >
            {({ values }) => (
              <Form>
                <FormikControl
                  control="input"
                  label="Title"
                  type="text"
                  name="title"
                  placeholder="Title of the article"
                />

                <FormikControl
                  control="input"
                  label="Leader"
                  type="text"
                  name="leader"
                  placeholder="Grab the reader's attention with something catchy!"
                />

                <FormikControl
                  control="select"
                  label="Category"
                  name="category"
                  options={dropdownOptions}
                />

                <h3>Body</h3>

                {!editBody && (
                  <>
                    {paragraphs &&
                      paragraphs.map((paragraph) => (
                        <p
                          key={`${paragraph}${Math.random()}`}
                          className="mb-2"
                        >
                          {paragraph}
                          <br />
                        </p>
                      ))}

                    <Button
                      onClick={() => setEditBody(true)}
                      className="mb-4 btn-sm"
                    >
                      Edit Body?
                    </Button>
                  </>
                )}
                {editBody && (
                  <>
                    <FormikControl
                      control="input"
                      as="textarea"
                      name="body"
                      placeholder="All the details. Try to write fluently and without being boring!"
                      rows="15"
                    />
                    <Button
                      onClick={() => setEditBody(false)}
                      variant="danger"
                      className="mb-2 btn-sm"
                    >
                      Cancel Edit Body?
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
              setEditBody(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListArticlesScreen;
