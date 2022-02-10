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
    <FormContainer>
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
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="dateOfBirth">
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
          <Form.Group controlId="password">
            <Form.Label>Enter New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="new password">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm New password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="outline-warning" className="p-2">
            Reset Password
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default AccountResetScreen;
