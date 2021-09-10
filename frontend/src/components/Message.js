import { useState } from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, heading, children }) => {
  const [show, setShow] = useState(true);

  const closeAlert = () => {
    setShow(false);
  };

  if (show) {
    setTimeout(closeAlert, 4000);
  }

  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{heading}</Alert.Heading>
        {children}
      </Alert>
    );
  } else {
    return null;
  }
};

export default Message;
