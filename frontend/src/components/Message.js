import { Alert } from "react-bootstrap";

const Message = ({ variant, heading, children }) => {
  return (
    <Alert variant={variant}>
      <Alert.Heading>{heading}</Alert.Heading>
      {children}
    </Alert>
  );
};

export default Message;
