import { Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Logo from "../img/logo2021a.png";

const LostScreen = () => {
  const history = useHistory();
  return (
    <Container className="text-center text-warning">
      <img src={Logo} alt="" className="max-width-500 mt-5" />
      <h1 className="text-warning">404!</h1>
      <h4>I'm sorry, the page you are looking for does not exist.</h4>
      <p>Try going back or select a different page from the menu</p>
      <Button onClick={() => history.goBack()}>Go Back</Button>
    </Container>
  );
};

export default LostScreen;
