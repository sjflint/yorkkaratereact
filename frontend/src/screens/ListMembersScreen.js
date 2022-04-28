import { useState, useEffect } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, Route } from "react-router-dom";
import { deleteMember, membersList } from "../actions/memberActions";
import Loader from "../components/Loader";
import MemberPaginate from "../components/MemberPaginate";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";

const ListMembersScreen = ({ history, match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const activeMembers = [];

  const listMembers = useSelector((state) => state.listMembers);
  const { loading, error, memberList, pages, page } = listMembers;

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
      history.push("/login?redirect=/profile");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      dispatch(membersList(pageNumber, keyword));
    }
  }, [dispatch, history, memberInfo, member, pageNumber, keyword]);

  const deleteHandler = async () => {
    dispatch(deleteMember(deleteId));
    setShow(false);
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
        <Route
          render={({ history }) => (
            <SearchBox history={history} path={"/admin/listmembers/"} />
          )}
        />
      </div>
      <h3 className="text-center border-bottom border-warning pb-1">
        Member List
      </h3>

      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
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
                  {member.ddMandate === "Cancelled" ? (
                    <td>
                      {member.firstName} {member.lastName}
                    </td>
                  ) : (
                    <td>
                      <Link to={`/admin/members/${member._id}/edit`}>
                        {member.firstName} {member.lastName}
                      </Link>
                    </td>
                  )}

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
                        variant="danger"
                        className="btn-sm"
                        onClick={() => {
                          setShow(true);
                          setDeleteId(member._id);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    ) : (
                      <LinkContainer to={`/admin/members/${member._id}/edit`}>
                        <Button variant="success" className="btn-sm">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </LinkContainer>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MemberPaginate pages={pages} page={page} editList={true} />
          </div>
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
