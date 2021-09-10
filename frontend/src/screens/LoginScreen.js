import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/memberActions";

const LoginScreen = ({ location, history }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { loading, error, memberInfo } = memberLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/profile";

  useEffect(() => {
    if (memberInfo) {
      history.push(redirect);
    }
  }, [history, memberInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(name.toLowerCase().split(" ").join(""), password));
  };

  return (
    <FormContainer>
      <h1 className="text-center">Member Sign In</h1>

      {error && <Message variant="danger">Incorrect Login details</Message>}
      {loading && <Loader variant="warning" />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          <Link to={"/reset-account"}>Forgotten username or password?</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
