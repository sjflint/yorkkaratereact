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
import ArticlePaginate from "../components/ArticlePaginate";
import { UPLOAD_IMG_CLEAR } from "../constants/uploadFileConstants";

const ListArticlesScreen = ({ history, match }) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [image, setImage] = useState();
  const [multiImage, setMultiImage] = useState([]);

  const pageNumber = match.params.pageNumber || 1;

  const singleImageData = (singleImage) => {
    console.log("running");
    setImage(singleImage);

    const image = {
      original: singleImage,
      thumbnail: singleImage,
    };

    if (multiImage.some((x) => x.original === singleImage)) {
      console.log("image already added");
    } else {
      setMultiImage([...multiImage, image]);
      console.log("image added to array");
    }
  };

  const changeHeaderImage = (img) => {
    let newArray = multiImage.filter((item) => item.original !== img.original);
    newArray.unshift(img);
    setMultiImage(newArray);
  };

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const articleList = useSelector((state) => state.articleList);
  const { loading, error, articles, pages, page } = articleList;

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
    } else if (!memberInfo.isAuthor) {
      history.push("/profile");
    } else {
      dispatch(listArticles(pageNumber));
    }
  }, [
    dispatch,
    history,
    memberInfo,
    member,
    successDelete,
    successCreate,
    successUpdate,
    pageNumber,
  ]);

  const deleteHandler = async () => {
    dispatch(deleteArticle(deleteId));
    setDeleteModal(false);
  };

  const createHandler = (values) => {
    values.authorId = member._id;
    values.image = image;
    values.carouselImages = multiImage;

    dispatch(createArticle(values));
    setCreateModal(false);
    setMultiImage([]);
  };

  const editHandler = async (values) => {
    values.carouselImages = multiImage;
    values.id = updateId;

    dispatch(updateArticle(values));

    setEditModal(false);
    setMultiImage([]);
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
      author: `${member.firstName} ${member.lastName}`,
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
    body: Yup.string().min(1000).required("Required"),
    image: Yup.string(),
    title: Yup.string().required("Required"),
    leader: Yup.string().max(150).required("Required"),
    author: Yup.string(),
    authorImg: Yup.string(),

    category: Yup.string().required("Required"),
  });

  let editInitialValues = {};

  editInitialValues = {
    title: article.title,
    leader: article.leader,
    body: article.body,
    category: article.category,
    author: article.author,
    authorImg: article.authorImg,
    dateCreated: article.dateCreated,
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
        <Button
          variant="outline-secondary"
          className="py-0"
          onClick={() => {
            setCreateModal(true);
            setImage(imagePlaceholder);
            dispatch({ type: UPLOAD_IMG_CLEAR });
          }}
        >
          <i className="fas fa-plus"></i> Write Article
        </Button>
      </div>
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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id}>
                  <td
                    className="text-center align-middle mouse-hover-pointer max-width-100"
                    onClick={async () => {
                      setUpdateId(article._id);

                      await dispatch(listArticle(article._id));
                      await setImage(article.image);
                      setMultiImage(article.carouselImages);
                      await setEditModal(true);
                    }}
                  >
                    <img
                      src={`${article.carouselImages[0].original}`}
                      alt="article"
                    />
                  </td>
                  <td
                    className="text-center align-middle mouse-hover-pointer max-width-200"
                    onClick={async () => {
                      setUpdateId(article._id);
                      dispatch({ type: UPLOAD_IMG_CLEAR });
                      await dispatch(listArticle(article._id));
                      await setImage(article.image);
                      setMultiImage(article.carouselImages);
                      await setEditModal(true);
                    }}
                  >
                    {article.title}
                  </td>

                  <td className="text-center align-middle">
                    {article.category}
                  </td>
                  <td>
                    <Button
                      variant="success"
                      className="btn btn-sm"
                      onClick={async () => {
                        setUpdateId(article._id);
                        dispatch({ type: UPLOAD_IMG_CLEAR });
                        await dispatch(listArticle(article._id));
                        await setImage(article.image);
                        setMultiImage(article.carouselImages);
                        await setEditModal(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>{" "}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      className="btn btn-sm"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(article._id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ArticlePaginate pages={pages} page={page} editList={true} />
          </div>
        </>
      )}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            Permanently Delete Article?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the article from the database and
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

      <Modal
        show={createModal}
        onHide={() => {
          setCreateModal(false);
          setMultiImage([]);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Write a new article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                      className="w-100 btn-sm btn-secondary mt-1 py-0"
                    >
                      Remove Image
                    </Button>
                    {index !== 0 ? (
                      <Button
                        className="w-100 btn-sm btn-secondary my-1 py-0"
                        onClick={() => changeHeaderImage(image)}
                      >
                        Set as Title Image
                      </Button>
                    ) : (
                      <Button
                        className="w-100 btn-sm btn-secondary my-1 py-0"
                        disabled
                      >
                        Title Image
                      </Button>
                    )}
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
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Title"
                    type="text"
                    name="title"
                    placeholder="Title of the article"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Leader"
                    type="text"
                    name="leader"
                    placeholder="Grab the reader's attention with something catchy!"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    as="textarea"
                    label="The Article Body"
                    name="body"
                    placeholder="All the details. Try to write fluently and without being boring!"
                    rows="15"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Category"
                    name="category"
                    options={dropdownOptions}
                  />
                </div>
                <button type="submit" className="btn-block btn-default btn">
                  Create
                </button>
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

          setMultiImage([]);
        }}
      >
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Edit Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {article && (
            <>
              <UploadImage
                singleImageData={singleImageData}
                type={"Article"}
                buttonText="Add another image"
                id={article._id}
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
                      <Col key={index} xs={6}>
                        <img src={`${image.original}`} alt="article" />
                        {multiImage.length > 1 && (
                          <>
                            <Button
                              onClick={async () => {
                                const images = multiImage;
                                images.splice(index, 1);
                                setMultiImage(images);
                                await setEditModal(false);
                                await setEditModal(true);
                              }}
                              className="w-100 btn-sm btn-secondary mt-2 py-0"
                            >
                              Remove Image
                            </Button>
                            {index !== 0 ? (
                              <Button
                                className="w-100 btn-sm btn-secondary my-1 py-0"
                                onClick={() => changeHeaderImage(image)}
                              >
                                Set as Title Image
                              </Button>
                            ) : (
                              <Button
                                className="w-100 btn-sm btn-secondary my-1 py-0"
                                disabled
                              >
                                Title Image
                              </Button>
                            )}
                          </>
                        )}
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
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Title"
                    type="text"
                    name="title"
                    placeholder="Title of the article"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Leader"
                    type="text"
                    name="leader"
                    placeholder="Grab the reader's attention with something catchy!"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="select"
                    label="Category"
                    name="category"
                    options={dropdownOptions}
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <h5 className="mt-3">Body</h5>

                  <div className="bg-light p-2 mb-2">
                    <FormikControl
                      control="input"
                      as="textarea"
                      name="body"
                      placeholder="All the details. Try to write fluently and without being boring!"
                      rows="15"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="d-block w-100"
                  variant="default"
                >
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
