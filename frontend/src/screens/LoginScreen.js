import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/memberActions";

const LoginScreen = ({ location, history }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
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
    const values = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    dispatch(login(values));
  };

  return (
    <FormContainer>
      <h1 className="text-center">Member Sign In</h1>

      {error && <Message variant="danger">Incorrect Login details</Message>}
      {loading && <Loader variant="warning" />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <div className="d-flex justify-content-around">
          <Button type="submit" variant="primary" className="px-5">
            Sign In
          </Button>

          <Link to={"/reset-account"}>
            <Button variant="warning">Forgotten password?</Button>
          </Link>
        </div>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
