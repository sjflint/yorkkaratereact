import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  listProducts,
  deleteProduct,
  createProduct,
  listProduct,
  updateProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import * as Yup from "yup";
import { Formik, Form, FieldArray } from "formik";
import FormikControl from "../components/FormComponents/FormikControl";
import imagePlaceholder from "../img/defaultplaceholder.jpg";
import UploadImage from "../components/uploadImage";
import ProductPaginate from "../components/ProductPaginate";
import { UPLOAD_IMG_CLEAR } from "../constants/uploadFileConstants";

const ListProductsScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [image, setImage] = useState();

  const singleImageData = (singleImage) => {
    setImage(singleImage);
  };

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const displayProduct = useSelector((state) => state.displayProduct);
  const { error: productError, product } = displayProduct;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { error: errorUpdate, success: successUpdate } = productUpdate;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = productCreate;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!memberInfo) {
      history.push("/login?redirect=shopadmin/editproducts");
    } else if (!memberInfo.isShopAdmin) {
      history.push("/profile");
    } else {
      dispatch(listProducts(pageNumber));
    }
  }, [
    dispatch,
    history,
    memberInfo,
    successDelete,
    successCreate,
    successUpdate,
    member.isShopAdmin,
    pageNumber,
  ]);

  const deleteHandler = async () => {
    dispatch(deleteProduct(deleteId));
    setDeleteModal(false);
  };

  const createProductHandler = (values) => {
    values.image = image;
    if (values.heldInStock === "true") {
      values.countInStock = values.sizes.reduce(
        (o, key) => ({ ...o, [key]: 0 }),
        {}
      );
    }
    dispatch(createProduct(values));
    setCreateModal(false);
  };

  const editProductHandler = async (values) => {
    values.id = updateId;
    values.image = image;

    if (values.heldInStock === "true") {
      values.countInStock = values.sizes.reduce(
        (o, key) => ({ ...o, [key]: 0 }),
        {}
      );
    } else {
      values.countInStock = null;
    }
    dispatch(updateProduct(values));

    setEditModal(false);
  };

  const updateStock = async (e) => {
    e.preventDefault();
    product.id = updateId;

    for (let i = 0; i < e.target.length - 1; i++) {
      const key = Object.keys(product.countInStock)[i];

      product.countInStock[key] = Number(e.target[i].value);
    }

    await dispatch(updateProduct(product));
    await setStockModal(false);
  };

  let initialValues;

  // Dropdown options for category
  const dropdownOptions = [
    { key: "Please select category", value: "" },
    { key: "uniform/gi", value: `uniform/gi` },
    { key: "equipment/protection", value: "equipment/protection" },
    { key: "clothing", value: "clothing" },
  ];

  const inStock = [
    { key: "Held In Stock", value: "true" },
    { key: "Made To Order/bespoke", value: "false" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    price: Yup.number(),
    sizes: Yup.array().min(1),
    category: Yup.string().required("Required"),
    heldInStock: Yup.string().required("Is this product held in Stock?"),
  });

  let editInitialValues = {};
  let heldInStock;

  if (product.name) {
    if (product.countInStock) {
      heldInStock = "true";
    } else {
      heldInStock = "false";
    }

    editInitialValues = {
      sizes: product.sizes,
      name: product.name,
      description: product.description,
      price: product.price.toFixed(2),
      image: product.image,
      category: product.category,
      countInStock: product.countInStock,
      todaysDate: new Date(),
      heldInStock: heldInStock,
    };
  }

  if (member) {
    initialValues = {
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      todaysDate: new Date(),
      heldInStock: "",
      sizes: [""],
    };
  }

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
          <i className="fas fa-plus"></i> Create Product
        </Button>
      </div>
      {loadingDelete && <Loader variant="warning" />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader variant="warning" />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {productError && <Message variant="danger">{productError}</Message>}

      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h3 className="text-center border-bottom border-warning pb-1">
            Products
          </h3>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr className="text-center">
                <th></th>
                <th>Name</th>
                <th>Edit</th>
                <th>Stock Level</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td
                    style={{ maxWidth: "40px" }}
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      dispatch({ type: UPLOAD_IMG_CLEAR });
                      setUpdateId(product._id);
                      await dispatch(listProduct(product._id));
                      await setImage(product.image);
                      await setEditModal(true);
                    }}
                  >
                    <img
                      src={`${product.image}`}
                      alt="product"
                      max-width="10"
                    />
                  </td>
                  <td
                    className="text-center align-middle mouse-hover-pointer"
                    onClick={async () => {
                      dispatch({ type: UPLOAD_IMG_CLEAR });
                      setUpdateId(product._id);
                      await dispatch(listProduct(product._id));
                      await setImage(product.image);
                      await setEditModal(true);
                    }}
                  >
                    {product.name}
                  </td>
                  <td>
                    <Button
                      variant="success"
                      className="btn btn-sm"
                      onClick={async () => {
                        dispatch({ type: UPLOAD_IMG_CLEAR });
                        setUpdateId(product._id);
                        await dispatch(listProduct(product._id));
                        await setImage(product.image);
                        await setEditModal(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>{" "}
                    </Button>
                  </td>
                  <td>
                    {product.countInStock ? (
                      <div className="notification-container">
                        <Button
                          variant="info"
                          className="btn btn-sm"
                          onClick={async () => {
                            setUpdateId(product._id);
                            await dispatch(listProduct(product._id));
                            await setImage(product.image);
                            await setStockModal(true);
                          }}
                        >
                          <i className="fas fa-box-open"></i>{" "}
                          {Object.keys(product.countInStock).map(
                            (stock) =>
                              product.countInStock[stock] === 0 && (
                                <div className="stock-notification d-flex align-items-center justify-content-center">
                                  !
                                </div>
                              )
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="info" className="btn-sm" disabled>
                        <i className="fas fa-x"></i>
                      </Button>
                    )}
                  </td>
                  <td className="align-middle">
                    <Button
                      variant="danger"
                      className="btn btn-sm"
                      onClick={() => {
                        setDeleteModal(true);
                        setDeleteId(product._id);
                      }}
                    >
                      <i className="fas fa-trash"></i>{" "}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ProductPaginate
              pages={pages}
              page={page}
              editList={true}
              className="d-flex justify-content-center"
            />
          </div>
        </>
      )}

      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white">
            Permanently Delete Product?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the product from the database and
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
          <Modal.Title className="text-white">Create a new product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadImage type="Product" singleImageData={singleImageData} />
          <p className="text-center">
            Recommended aspect ratio: 1:1. Image will be cropped to fit
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={createProductHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Product Name"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="currency"
                    label="Price"
                    type="number"
                    name="price"
                    placeholder="Price"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FieldArray name="sizes">
                    {({ push, remove }) => (
                      <>
                        {values.sizes.map((_, index) => (
                          <Row className="mt-2">
                            <Col xs={8}>
                              <FormikControl
                                control="input"
                                label="Add Size"
                                type="text"
                                name={`sizes[${index}]`}
                                placeholder="Add size e.g. Small"
                              />
                            </Col>
                            <Col xs={4} className="mt-3">
                              <Button
                                variant="outline-danger"
                                onClick={() => remove(index)}
                                className="py-1 px-2 mt-4"
                              >
                                <i className="fa-solid fa-trash"></i> Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button
                          variant="outline-secondary"
                          className="py-0 mt-2"
                          onClick={() => push("")}
                        >
                          + Add another size
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    as="textarea"
                    label="Please provide a description"
                    name="description"
                    placeholder="Please provide a description"
                    rows="10"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="radio"
                    label="Is this product held in stock?"
                    name="heldInStock"
                    options={inStock}
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
                <Button
                  type="submit"
                  className="btn-block btn-default w-100 mt-2"
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

      <Modal
        show={editModal}
        onHide={() => {
          setEditModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product && (
            <>
              <UploadImage
                img={product.image}
                type={"Product"}
                id={product._id}
                singleImageData={singleImageData}
              />
              <p className="text-center">
                Recommended aspect ratio: 1:1. Image will be cropped to fit
              </p>
            </>
          )}

          <Formik
            initialValues={editInitialValues}
            validationSchema={validationSchema}
            onSubmit={editProductHandler}
          >
            {({ values }) => (
              <Form>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="input"
                    label="name"
                    type="text"
                    name="name"
                    placeholder="Product Name"
                  />
                </div>
                <div className="bg-light p-2 mb-2">
                  <div className="w-50">
                    <FormikControl
                      control="currency"
                      label="Price"
                      type="number"
                      name="price"
                      placeholder="Product Price"
                    />
                  </div>
                </div>
                <div className="bg-light p-2 mb-2">
                  <FieldArray name="sizes">
                    {({ push, remove }) => (
                      <>
                        {values.sizes.map((_, index) => (
                          <>
                            <Row className="mt-2">
                              <Col xs={8}>
                                <FormikControl
                                  control="input"
                                  label="Add Size"
                                  type="text"
                                  name={`sizes[${index}]`}
                                  placeholder="Add size e.g. Small"
                                />
                              </Col>
                              <Col xs={4} className="mt-3">
                                <Button
                                  variant="outline-danger"
                                  onClick={() => remove(index)}
                                  className="py-1 px-2 mt-4"
                                >
                                  <i className="fa-solid fa-trash"></i> Remove
                                </Button>
                              </Col>
                            </Row>
                          </>
                        ))}
                        <Button
                          variant="outline-secondary"
                          className="py-0 mt-2"
                          onClick={() => push("")}
                        >
                          + Add another size
                        </Button>
                      </>
                    )}
                  </FieldArray>
                </div>
                <div className="bg-light p-2 mb-2">
                  <FormikControl
                    control="radio"
                    label="Is this product held in stock?"
                    name="heldInStock"
                    options={inStock}
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
                  <h5 className="mt-3">Description</h5>

                  <FormikControl
                    control="input"
                    as="textarea"
                    label="Please provide a description"
                    name="description"
                    placeholder="Please enter a new description..."
                    rows="10"
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-block btn-default w-100 mt-2"
                >
                  Update
                </Button>
                <small className="text-warning">
                  PLEASE NOTE: Following any updates to the product, you will
                  need to reset the product's stock level
                </small>
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

      <Modal
        show={stockModal}
        onHide={() => {
          setStockModal(false);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Edit Stock level</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product.countInStock && (
            <>
              <img src={`${image}`} alt="" />

              <h5 className="text-center my-3">
                {product.name} <br />
                Current Stock Levels
              </h5>
              <form onSubmit={updateStock}>
                {Object.keys(product.countInStock).map((stock) => (
                  <FormGroup key={product._id}>
                    <FormLabel>{stock}</FormLabel>

                    <FormControl
                      type="text"
                      defaultValue={product.countInStock[stock]}
                      className="w-50"
                    ></FormControl>
                  </FormGroup>
                ))}
                <Button
                  type="submit"
                  className="btn btn-block btn-default w-100 mt-2"
                >
                  Update
                </Button>
              </form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            variant="secondary"
            onClick={() => {
              setStockModal(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListProductsScreen;
