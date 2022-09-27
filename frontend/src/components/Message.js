import { Alert, Button } from "react-bootstrap";
import Broken from "../img/broken.svg";

const Message = ({ variant, heading, children }) => {
  return (
    <Alert variant={variant} className="text-center py-1">
      {variant === "danger" ||
        (variant === "warning" && (
          <>
            <h4>
              Oh no! <br /> Something's gone wrong.
            </h4>
            <img src={Broken} alt="" className="max-width-200" />
          </>
        ))}
      <Alert.Heading>{heading}</Alert.Heading>
      {children}
      <br />
      {variant === "danger" ||
        (variant === "warning" && (
          <>
            <small>
              For assistance, email{" "}
              <a href="mailto:info@yorkkarate.net">info@yorkkarate.net</a>
            </small>
            <br />
            <Button onClick={() => window.location.reload(false)}>
              Reload
            </Button>
          </>
        ))}
    </Alert>
  );
};

export default Message;
