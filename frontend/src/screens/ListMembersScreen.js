import { useState, useEffect } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { deleteMember, membersList } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ListMembersScreen = ({ history }) => {
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;
  const activeMembers = [];

  const listMembers = useSelector((state) => state.listMembers);
  const { loading, error, memberList } = listMembers;

  if (memberList) {
    memberList.map((member) => {
      if (member.ddMandate !== "Cancelled") {
        return activeMembers.push(member);
      }
      return activeMembers;
    });
  }

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    } else if (!memberInfo.isAdmin) {
      history.push("/");
    } else {
      dispatch(membersList());
    }
  }, [dispatch, history, memberInfo]);

  const deleteHandler = async () => {
    dispatch(deleteMember(deleteId));
    setShow(false);
  };

  return (
    <Container fluid="lg">
      <Link className="btn btn-dark" to="/admin">
        <i className="fas fa-arrow-left"></i> Return
      </Link>
      <h3 className="text-center border-bottom border-warning pb-1">
        Member List
      </h3>
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <h5 className="my-2">Total active members: {activeMembers.length}</h5>
          <h5 className="my-2">
            Total inactive members still on record:{" "}
            {memberList.length - activeMembers.length}
          </h5>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => (
                <tr key={member._id}>
                  <td>
                    {member.firstName} {member.lastName}
                  </td>
                  <td>
                    <a href={`mailto:${member.email}`}> {member.email}</a>
                  </td>
                  <td>
                    <a href={`tel:0${member.phone}`}>0{member.phone}</a>
                  </td>
                  <td>
                    {member.ddMandate === "Cancelled" ? "Cancelled" : "Active"}
                  </td>
                  <td>
                    {member.ddMandate === "Cancelled" ? (
                      <Button
                        variant="light"
                        className="btn-sm"
                        onClick={() => {
                          setShow(true);
                          setDeleteId(member._id);
                        }}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "red" }}
                        ></i>
                      </Button>
                    ) : (
                      <LinkContainer to={`/admin/members/${member._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <i
                            className="fas fa-edit"
                            style={{ color: "green" }}
                          ></i>
                        </Button>
                      </LinkContainer>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Permanently Delete Member?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently delete the user from the database and the
          details will be irretrievable. <br /> Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListMembersScreen;
