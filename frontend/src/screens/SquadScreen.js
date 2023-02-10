import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { editMember, membersList } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { LIST_MEMBERS_RESET } from "../constants/memberConstants";

const SquadScreen = () => {
  const dispatch = useDispatch();

  const [squadMember, setSquadMember] = useState();
  const [kata, setKata] = useState(false);

  const listMembers = useSelector((state) => state.listMembers);
  const { loading, error, memberList, pages, page } = listMembers;

  const memberEdit = useSelector((state) => state.memberEdit);
  const { loading: editLoading, error: errorLoading, success } = memberEdit;

  useEffect(() => {
    if (!memberList || memberList.length === 0) {
      dispatch(membersList(0, "squad"));
    }
    // if (success) {
    //   dispatch(membersList(0, "squad"));
    // }
  }, [dispatch]);

  const numMarker = (num) => {
    return num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";
  };

  const updateHandler = (member) => {
    const values = member;
    values.memberId = member._id;
    console.log(values);
    dispatch(editMember(values));
  };

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
                <th>Grade</th>
                <th>Age (calculated)</th>
                <th>Kata</th>
                <th>Kumite</th>
                <th>Weight</th>
                <th>Attendance Record</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
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
                          Date.now() - new Date(member.dateOfBirth).getTime()
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
    </>
  );
};

export default SquadScreen;
