import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { passwordReset } from "../actions/memberActions";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const AccountResetScreen = () => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState("password");

  const resetPassword = useSelector((state) => state.resetPassword);
  const { loading, error, success } = resetPassword;

  const submitHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setPasswordError(false);
      const values = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        dateOfBirth: dateOfBirth,
        newPassword: password,
      };

      dispatch(passwordReset(values));
    } else {
      setPasswordError(true);
    }
  };

  return (
    <FormContainer className="mt-3">
      <h1 className="text-center">Password Reset</h1>
      {loading && <Loader variant="warning" />}
      {success && (
        <div className="text-center">
          <Message variant="success">Password Updated</Message>
          <Link to={"/login"}>
            <Button variant="default" className="text-center">
              Return to Login Page
            </Button>
          </Link>
        </div>
      )}
      {error && (
        <div className="text-center">
          <Message variant="danger">
            Cannot update password with the details provided
          </Message>
        </div>
      )}
      {!loading && !success && (
        <Form onSubmit={submitHandler} className="text-muted">
          <Form.Group controlId="firstName" className="mb-3 bg-light p-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="lastName" className="mb-3 bg-light p-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="mb-3 bg-light p-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="dateOfBirth" className="mb-3 bg-light p-2">
            <Form.Label>Date Of Birth</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date of birth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <br />
          {passwordError && (
            <Message variant="danger">Passwords don't match</Message>
          )}
          <Form.Group controlId="password" className="mb-3 bg-light p-2">
            <Form.Label>Enter New Password</Form.Label>
            <Form.Control
              type={showPassword}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
            {showPassword === "password" ? (
              <small
                onClick={() => setShowPassword("text")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-eye inside-input"></i> Show Passwords
              </small>
            ) : (
              <small
                onClick={() => setShowPassword("password")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-eye-slash"></i> Hide Passwords
              </small>
            )}
          </Form.Group>
          <Form.Group controlId="new password" className="mb-3 bg-light p-2">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type={showPassword}
              placeholder="Confirm New password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
            {showPassword === "password" ? (
              <small
                onClick={() => setShowPassword("text")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-eye inside-input"></i> Show Passwords
              </small>
            ) : (
              <small
                onClick={() => setShowPassword("password")}
                style={{ cursor: "pointer" }}
              >
                <i className="fa-solid fa-eye-slash"></i> Hide Passwords
              </small>
            )}
          </Form.Group>
          <Button
            type="submit"
            variant="outline-secondary"
            className="p-2 w-100"
          >
            Reset Password
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default AccountResetScreen;
