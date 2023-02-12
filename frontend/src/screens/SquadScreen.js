import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { editMember, membersList } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const SquadScreen = () => {
  const dispatch = useDispatch();

  const today = new Date();

  const [kataFilter, setKataFilter] = useState(false);
  const [kumiteFilter, setKumiteFilter] = useState(false);

  const [date, setDate] = useState(today.toISOString().split("T")[0]);

  const [gradeFilterMin, setGradeFilterMin] = useState(false);
  const [gradeFilterMax, setGradeFilterMax] = useState(0);
  const [gradeFilterModal, setGradeFilterModal] = useState(false);

  const [ageFilterMin, setAgeFilterMin] = useState(false);
  const [ageFilterMax, setAgeFilterMax] = useState(18);
  const [ageFilterModal, setAgeFilterModal] = useState(false);

  let listMembers = useSelector((state) => state.listMembers);
  let { loading, error, memberList, pages, page } = listMembers;

  useEffect(() => {
    if (!memberList || memberList.length === 0) {
      dispatch(membersList(0, "squad"));
    }
  }, [dispatch]);

  const numMarker = (num) => {
    return num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
  };

  const updateHandler = async (member) => {
    const values = member;
    values.memberId = member._id;
    console.log(values);
    await dispatch(editMember(values));
    await dispatch(membersList(0, "squad"));
  };

  let memberListFilter = [];

  if (memberList) {
    memberListFilter = memberList;

    if (kataFilter === true) {
      const result = memberListFilter.filter(
        (member) => member.squadDiscipline.kata
      );
      memberListFilter = result;
    }
    if (kumiteFilter === true) {
      const result = memberListFilter.filter(
        (member) => member.squadDiscipline.kumite
      );
      memberListFilter = result;
    }
    if (gradeFilterMin != false) {
      // sort by grade
      memberListFilter.sort((a, b) => {
        return b.kyuGrade - a.kyuGrade;
      });
      const result = memberListFilter.filter(
        (member) =>
          member.kyuGrade <= gradeFilterMin && member.kyuGrade >= gradeFilterMax
      );
      memberListFilter = result;
    }
    if (ageFilterMin != false) {
      // sort by age
      memberListFilter.sort((a, b) => {
        return new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
      });
      const result = memberListFilter.filter((member) => {
        const age = Math.abs(
          new Date(
            new Date(date) - new Date(member.dateOfBirth).getTime()
          ).getFullYear() - 1970
        );
        console.log(age);
        return age >= ageFilterMin && age <= ageFilterMax;
      });
      memberListFilter = result;
    }
  }

  const gradeOptions = [
    { label: "Please select" },
    { value: 1, label: "1st kyu" },
    { value: 2, label: "2nd kyu" },
    { value: 3, label: "3rd kyu" },
    { value: 4, label: "4th kyu" },
    { value: 5, label: "5th kyu" },
    { value: 6, label: "6th kyu" },
    { value: 7, label: "7th kyu" },
    { value: 8, label: "8th kyu" },
    { value: 16, label: "9th kyu or lower" },
  ];

  const ageOptions = [
    { label: "Please select" },
    { value: 7, label: "7 years old or under" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18 or above" },
  ];

  return (
    <>
      <Container fluid="md">
        <h3 className="text-center border-bottom border-warning pb-1 mt-4">
          Squad Administration
        </h3>
        {loading && <Loader variant="warning" />}
        {error && <Message variant="danger">{error}</Message>}
        {memberList && (
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>
                  Grade
                  <br />{" "}
                  {gradeFilterMin ? (
                    <i
                      className="fa-solid fa-filter fa-2x text-info"
                      onClick={() => {
                        setGradeFilterModal(true);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-filter"
                      onClick={() => {
                        setGradeFilterModal(true);
                      }}
                    ></i>
                  )}
                </th>
                <th>
                  <br />
                  Age (calculated)
                  <br />{" "}
                  {ageFilterMin ? (
                    <i
                      className="fa-solid fa-filter fa-2x text-info"
                      onClick={() => {
                        setAgeFilterModal(true);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-filter"
                      onClick={() => {
                        setAgeFilterModal(true);
                      }}
                    ></i>
                  )}
                </th>
                <th>
                  Kata
                  <br />
                  {!kataFilter ? (
                    <i
                      className="fa-solid fa-filter"
                      onClick={() => {
                        setKataFilter(true);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-filter text-info fa-2x"
                      onClick={() => {
                        setKataFilter(false);
                      }}
                    ></i>
                  )}
                </th>
                <th>
                  Kumite
                  <br />
                  {!kumiteFilter ? (
                    <i
                      className="fa-solid fa-filter"
                      onClick={() => {
                        setKumiteFilter(true);
                      }}
                    ></i>
                  ) : (
                    <i
                      className="fa-solid fa-filter text-info fa-2x"
                      onClick={() => {
                        setKumiteFilter(false);
                      }}
                    ></i>
                  )}
                </th>
                <th>Weight</th>
                <th>Attendance Record</th>
              </tr>
            </thead>
            <tbody>
              {memberListFilter &&
                memberListFilter.map((member) => {
                  return (
                    <tr key={member._id}>
                      <td>
                        <Link to={`/admin/members/${member._id}/edit`}>
                          {member.firstName} {member.lastName}
                        </Link>
                      </td>
                      <td>{member.email}</td>
                      {member.kyuGrade > 0 ? (
                        <td>
                          {member.kyuGrade}
                          {numMarker(member.kyuGrade)} kyu
                        </td>
                      ) : (
                        <td>
                          {member.danGrade}
                          {numMarker(member.danGrade)} dan
                        </td>
                      )}
                      <td>
                        {Math.abs(
                          new Date(
                            new Date(date) -
                              new Date(member.dateOfBirth).getTime()
                          ).getFullYear() - 1970
                        )}
                      </td>
                      <td>
                        <>
                          {member.squadDiscipline &&
                          member.squadDiscipline.kata ? (
                            <i
                              className="fa-solid fa-circle-check text-success fa-3x"
                              onClick={() => {
                                member.squadDiscipline.kata
                                  ? (member.squadDiscipline.kata = false)
                                  : (member.squadDiscipline.kata = true);
                                updateHandler(member);
                              }}
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-circle-xmark text-danger fa-3x"
                              onClick={() => {
                                member.squadDiscipline.kata
                                  ? (member.squadDiscipline.kata = false)
                                  : (member.squadDiscipline.kata = true);
                                updateHandler(member);
                              }}
                            ></i>
                          )}
                        </>
                      </td>
                      <td>
                        <>
                          {member.squadDiscipline &&
                          member.squadDiscipline.kumite ? (
                            <i
                              className="fa-solid fa-circle-check text-success fa-3x"
                              onClick={() => {
                                member.squadDiscipline.kumite
                                  ? (member.squadDiscipline.kumite = false)
                                  : (member.squadDiscipline.kumite = true);
                                updateHandler(member);
                              }}
                            ></i>
                          ) : (
                            <i
                              className="fa-solid fa-circle-xmark text-danger fa-3x"
                              onClick={() => {
                                member.squadDiscipline.kumite
                                  ? (member.squadDiscipline.kumite = false)
                                  : (member.squadDiscipline.kumite = true);
                                updateHandler(member);
                              }}
                            ></i>
                          )}
                        </>
                      </td>

                      <td>{member.weight ? `${member.weight}kg` : "-"}</td>
                      <td>{((member.squadAttScore / 12) * 100).toFixed(0)}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
      </Container>
      {/* grade modal */}
      <Modal
        size="sm"
        show={gradeFilterModal}
        onHide={() => setGradeFilterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Grade Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="text-center mb-3">
            <Form.Label>Minimum Grade</Form.Label>
            <Form.Select onChange={(e) => setGradeFilterMin(e.target.value)}>
              {gradeOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="text-center">
            <Form.Label>max grade</Form.Label>

            <Form.Select onChange={(e) => setGradeFilterMax(e.target.value)}>
              {gradeOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setGradeFilterModal(false);
              setGradeFilterMin(false);
              setGradeFilterMax(false);
            }}
          >
            Cancel <i className="fa-solid fa-filter-circle-xmark"></i>
          </Button>
          <Button variant="primary" onClick={() => setGradeFilterModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* age filter modal */}
      <Modal
        size="sm"
        show={ageFilterModal}
        onHide={() => setAgeFilterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Age Filter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 text-center">
            <Form.Label>Date of Competition</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </Form.Group>

          <Form.Group className="text-center mb-3">
            <Form.Label>Minimum Age</Form.Label>
            <Form.Select onChange={(e) => setAgeFilterMin(e.target.value)}>
              {ageOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="text-center">
            <Form.Label>Maximum Age</Form.Label>
            <Form.Select onChange={(e) => setAgeFilterMax(e.target.value)}>
              {ageOptions.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setAgeFilterModal(false);
              setAgeFilterMin(false);
              setAgeFilterMax(false);
            }}
          >
            Cancel <i className="fa-solid fa-filter-circle-xmark"></i>
          </Button>
          <Button variant="primary" onClick={() => setAgeFilterModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SquadScreen;
