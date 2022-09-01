import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import logo from "../img/logo2021.png";
import { getMemberDetails, logout } from "../actions/memberActions";
import { useEffect } from "react";

const Header = () => {
  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { error } = memberDetails;

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (memberInfo) {
      dispatch(getMemberDetails("profile"));
    }
  }, [dispatch, memberInfo, error]);

  const loginErrorHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      {error && loginErrorHandler()}
      <Navbar
        bg="primary"
        variant="dark"
        expand="md"
        className="bg-black"
        collapseOnSelect
      >
        <Container className="w-80">
          <LinkContainer to="/">
            <Navbar.Brand className="text-center p-0">
              <img src={logo} alt="logo" id="img-logo" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto navLinks text-center">
              <LinkContainer to="/home">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/news">
                <Nav.Link>News</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Classes" id="basic-nav-dropdown">
                <LinkContainer to="/timetable">
                  <NavDropdown.Item>Timetable</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/agegroups">
                  <NavDropdown.Item href="/agegroups">
                    Age Groups and belt levels
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/venues">
                  <NavDropdown.Item href="/venues">Venues</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="/events">
                <Nav.Link>Events</Nav.Link>
              </LinkContainer>
              <NavDropdown title="Members" id="second-nav-dropdown">
                {memberInfo ? null : (
                  <LinkContainer to="/memberapplication">
                    <NavDropdown.Item>
                      Application form to join the club
                    </NavDropdown.Item>
                  </LinkContainer>
                )}
                <LinkContainer to="/shop">
                  <NavDropdown.Item>Shop</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/welfareandfundraising">
                  <NavDropdown.Item>Welfare and Fundraising</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/blackbelts">
                  <NavDropdown.Item>Club black belts</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="/contact">
                <Nav.Link>Contact</Nav.Link>
              </LinkContainer>
              {memberInfo ? (
                <NavDropdown title={memberInfo.firstName} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {(memberInfo.isAdmin ||
                    memberInfo.isShopAdmin ||
                    memberInfo.isInstructor ||
                    memberInfo.isAuthor) && (
                    <LinkContainer to="/admin">
                      <NavDropdown.Item>Admin Panel</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item
                    onClick={logoutHandler}
                    className="text-warning"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login" className="text-center">
                  <Nav.Link className="text-warning d-flex align-items-center justify-content-center">
                    <i className="fas fa-user"></i>
                    <small>Login</small>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
