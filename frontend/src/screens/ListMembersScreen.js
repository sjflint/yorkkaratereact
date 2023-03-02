import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, Route } from "react-router-dom";
import { deleteMember, membersList } from "../actions/memberActions";
import { getTrialList } from "../actions/trialRegistrationActions";
import Loader from "../components/Loader";
import MemberPaginate from "../components/MemberPaginate";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";

const ListMembersScreen = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const [show, setShow] = useState(false);
  const [trialModal, setTrialModal] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState("");
  const [medicalModal, setMedicalModal] = useState(false);

  const [deleteId, setDeleteId] = useState("");

  const dispatch = useDispatch();
  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const listMembers = useSelector((state) => state.listMembers);
  const { loading, error, memberList, pages, page } = listMembers;

  const trialList = useSelector((state) => state.trialList);
  const { loading: trialLoading, error: trialError, trialMembers } = trialList;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login?redirect=/profile");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      dispatch(membersList(pageNumber, keyword));
      dispatch(getTrialList());
    }
  }, [dispatch, history, memberInfo, member, pageNumber, keyword]);

  const deleteHandler = async () => {
    dispatch(deleteMember(deleteId));
    setShow(false);
  };

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-secondary py-0"
          onClick={() => history.goBack()}
        >
          <h4 className="d-inline text-muted">[</h4>
          <i className="fas fa-arrow-left"></i>
        </button>
        <Route
          render={({ history }) => (
            <SearchBox history={history} path={"/admin/listmembers/"} />
          )}
        />
      </div>
      <div className="text-center border-bottom border-warning pb-1">
        <h3>Member List</h3>
        <button className="btn btn-link" onClick={() => setTrialModal(true)}>
          View Trial Members
        </button>
      </div>

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
              {memberList.map((member) => {
                return (
                  member.ddMandate && (
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
                        {member.ddMandate === "Cancelled"
                          ? "Cancelled"
                          : member.ddMandate === "Failed"
                          ? "Failed"
                          : member.ddsuccess === false
                          ? "Pending"
                          : "Active"}
                      </td>
                      <td>
                        {member.ddsuccess === false ? (
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
                          <LinkContainer
                            to={`/admin/members/${member._id}/edit`}
                          >
                            <Button variant="success" className="btn-sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </LinkContainer>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </Table>
          <Container>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MemberPaginate pages={pages} page={page} editList={true} />
            </div>
          </Container>
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

      {/* medical modal */}
      <Modal show={medicalModal} onHide={() => setMedicalModal(false)}>
        <Modal.Header className="bg-grey" closeButton>
          <Modal.Title>Medical Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>{medicalInfo}</Modal.Body>
        <Modal.Footer className="bg-grey">
          <button
            className="btn btn-link"
            onClick={() => setMedicalModal(false)}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>

      {/* trial modal */}
      <Modal
        show={trialModal}
        onHide={() => setTrialModal(false)}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton className="bg-black border border-secondary">
          <Modal.Title className="text-warning">Trial Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trialLoading && <Loader variant="warning" />}
          {trialError && <Message variant="danger">{trialError}</Message>}
          {trialMembers && (
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>class</td>
                  <td>Email</td>
                  <td>Phone</td>
                  <td>Registered</td>
                  <td>Completed</td>
                </tr>
              </thead>
              <tbody>
                {trialMembers.map((member) => {
                  return (
                    <tr key={member._id}>
                      <td>
                        {member.firstName} {member.lastName}
                        <br />{" "}
                        {member.medicalStatus === "Yes medical" && (
                          <i
                            className="fa-solid fa-briefcase-medical text-danger fa-2x mouse-hover-pointer"
                            onClick={() => {
                              setMedicalInfo("");
                              setMedicalInfo(member.medicalDetails);
                              setMedicalModal(true);
                            }}
                          ></i>
                        )}
                      </td>
                      <td>
                        {member.classSelection.name} <br />
                        {member.classSelection.times}
                      </td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                      <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                      <td>
                        {member.completed ? (
                          <i className="fa-solid fa-circle-check text-success fa-2x"></i>
                        ) : (
                          <i className="fa-solid fa-circle-xmark text-danger fa-2x"></i>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-black border border-secondary">
          <button
            className="btn btn-link text-white"
            onClick={() => setTrialModal(false)}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListMembersScreen;
