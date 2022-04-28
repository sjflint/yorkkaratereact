import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImgDDSuccess from "../img/ddsuccess.png";

const DDUpdateSuccessScreen = ({ history }) => {
  localStorage.removeItem("updateDD");

  return (
    <Container className="text-center mt-3">
      <h1>Account successfuly reinstated</h1>
      <div className="d-block">
        <img src={ImgDDSuccess} alt="dd success" className="max-width-500" />
      </div>
      <div className="mt-4">
        <Link to="/profile">
          <Button variant="outline-warning">Return to Profile</Button>
        </Link>
      </div>
    </Container>
  );
};

export default DDUpdateSuccessScreen;
