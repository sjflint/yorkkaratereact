import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImgDDSuccess from "../img/ddsuccess.png";

const ddsuccessScreen = () => {
  return (
    <Container className="text-center">
      <h1>Account successfuly created</h1>
      <div className="d-block">
        <img src={ImgDDSuccess} alt="dd success" className="max-width-500" />
      </div>
      <div className="mt-4">
        <Link to="/profile">
          <Button variant="outline-warning">Visit Your Profile</Button>
        </Link>
      </div>
    </Container>
  );
};

export default ddsuccessScreen;
