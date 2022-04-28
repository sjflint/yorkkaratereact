import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  FormControl,
  FormGroup,
  FormLabel,
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

import { Formik, Form } from "formik";
import FormikControl from "../components/FormComponents/FormikControl";
import imagePlaceholder from "../img/defaultplaceholder.jpg";

import UploadImage from "../components/uploadImage";
import ProductPaginate from "../components/ProductPaginate";

const ListProductsScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [updateId, setUpdateId] = useState();
  const [editDescription, setEditDescription] = useState(false);
  const [image, setImage] = useState();

  const singleImageData = (singleImage) => {
    setImage(singleImage);
    console.log(singleImage);
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
      history.push("/login");
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
    values.description = values.description.split("\n");

    values.sizes = values.sizes.split(";");
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
    values.sizes = values.sizes.split(";");
    values.image = image;

    if (editDescription === false) {
      values.description = product.description;
    } else {
      values.description = values.description.split("\n");
    }
    if (values.heldInStock === "true") {
      values.countInStock = values.sizes.reduce(
        (o, key) => ({ ...o, [key]: 0 }),
        {}
      );
    } else {
      values.countInStock = null;
    }

    dispatch(updateProduct(values));
    setEditDescription(false);
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
  if (member) {
    initialValues = {
      sizes: "",
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      todaysDate: new Date(),
      heldInStock: "",
    };
  }

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
    sizes: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    price: Yup.number(),

    category: Yup.string().required("Required"),
    heldInStock: Yup.string().required("Is this product held in Stock?"),
  });

  let editInitialValues = {};
  let paragraphs;

  if (product.description !== undefined) {
    paragraphs = product.description;

    const productDescription = paragraphs.join("\n");
    let heldInStock;
    if (product.countInStock) {
      heldInStock = "true";
    } else {
      heldInStock = "false";
    }

    editInitialValues = {
      sizes: product.sizes.join(";"),
      name: product.name,
      description: productDescription,
      price: product.price.toFixed(2),
      image: product.image,
      category: product.category,
      countInStock: product.countInStock,
      todaysDate: new Date(),
      heldInStock: heldInStock,
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
                      </Button>
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
          <img src={`${image}`} alt="" />
          <UploadImage singleImageData={singleImageData} type="Product" />
          <p className="text-center">
            Recommended aspect ratio: 5:3. Image will be cropped to fit
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
                  <FormikControl
                    control="input"
                    label="Sizes"
                    type="text"
                    name="sizes"
                    placeholder="Add sizes, seperated by ;"
                  />
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
          setEditDescription(false);
        }}
      >
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title className="text-white">Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product && (
            <>
              <img src={`${image}`} alt="" />
              <UploadImage
                img={product.image}
                type={"Product"}
                id={product._id}
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
                  <FormikControl
                    control="input"
                    label="Sizes"
                    type="text"
                    name="sizes"
                    placeholder="Add sizes, seperated by ;"
                  />
                  <small className="text-muted">
                    include size, followed by ; (e.g. small;medium;large)
                  </small>
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
                        variant="outline-secondary"
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
                </div>
                <Button
                  type="submit"
                  className="btn-block btn-default w-100 mt-2"
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
              setEditDescription(false);
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
