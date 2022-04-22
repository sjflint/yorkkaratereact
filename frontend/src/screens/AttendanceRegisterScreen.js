import { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route } from "react-router-dom";
import {
  attendeeAdd,
  attendeeRemove,
  updateAttendance,
  attendeeExtraAdd,
} from "../actions/attendanceActions";
import { membersList } from "../actions/memberActions";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import Loader from "../components/Loader";
import SearchBox from "../components/SearchBox";

export const AttendanceRegisterScreen = ({ history, match }) => {
  const classId = match.params.className;
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  const attendanceList = useSelector((state) => state.attendanceList);
  const {
    loading: attendanceLoading,
    error: attendanceError,
    record,
  } = attendanceList;

  const listMembers = useSelector((state) => state.listMembers);
  const {
    loading: memberListLoading,
    error: memberListLoadingError,
    memberList,
  } = listMembers;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    } else if (!memberInfo.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listTrainingSessions());
      dispatch(updateAttendance(classId));
      if (keyword) {
        dispatch(membersList(pageNumber, keyword));
      }
    }
  }, [dispatch, classId, keyword]);

  const removeAttendeeHandler = async (id, recordId, className) => {
    await dispatch(attendeeRemove(id, recordId));
    await dispatch(updateAttendance(classId));
  };

  const addAttendeeHandler = async (id, recordId) => {
    await dispatch(attendeeAdd(id, recordId));
    await dispatch(updateAttendance(classId));
  };

  const addExtraAttendeeHandler = async (memberId) => {
    await dispatch(attendeeExtraAdd(memberId, record._id));
    await dispatch(updateAttendance(classId));
    history.push(`instructor/attendance/${classId}`);
  };

  let filteredMembersList = [];
  let participantsArray = [];

  if (trainingSessions) {
    trainingSessions.map((trainingSession) => {
      // build array of participant id's
      if (trainingSession._id == classId) {
        trainingSession.participants.map((id) =>
          participantsArray.push(id._id)
        );
      }
    });
  }

  const filterSearches = async () => {
    // check if extra participants get added
    if (record && record.length !== 0) {
      record.extraParticipants.map((participant) => {
        participantsArray.push(participant._id);
      });
    }

    if (trainingSessions) {
      trainingSessions.map((trainingSession) => {
        // find suitable members from search list
        if (memberList && trainingSession._id == classId) {
          memberList.map((member) => {
            if (
              member.kyuGrade < trainingSession.minGradeLevel &&
              member.kyuGrade > trainingSession.maxGradeLevel
            ) {
              if (participantsArray.includes(member._id)) {
                console.log("already attending");
              } else if (filteredMembersList.length !== 0) {
                filteredMembersList.map((filteredMember) => {
                  if (filteredMember._id === member._id) {
                    // do nothing
                  } else {
                    filteredMembersList.push(member);
                  }
                });
              } else {
                filteredMembersList.push(member);
              }
            }
          });
        }
      });
    }
  };
  filterSearches();

  return (
    <Container>
      <Link className="btn btn-dark" to="/instructor/attendance">
        <i className="fas fa-arrow-left"></i> Return To Attendance Screen
      </Link>
      {loading && <Loader variant="warning" />}
      {attendanceLoading && <Loader variant="warning" />}
      <Table
        striped
        bordered
        hover
        responsive
        className="table-sm text-center mt-3"
      >
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Present</th>
            <th>Not Present</th>
          </tr>
        </thead>
        <tbody>
          {trainingSessions &&
            record &&
            record.length !== 0 &&
            trainingSessions.map((trainingSession) => {
              if (trainingSession._id === classId) {
                return trainingSession.participants.map((participant) => {
                  return (
                    <tr key={participant._id}>
                      <td>
                        {participant.firstName} {participant.lastName}
                      </td>
                      {record.participants &&
                      record.participants.includes(
                        participant._id.toString()
                      ) ? (
                        <>
                          <td>
                            <i className="fa-solid fa-circle-check text-success fa-3x"></i>
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              className="btn-sm"
                              onClick={() =>
                                removeAttendeeHandler(
                                  participant._id,
                                  record._id
                                )
                              }
                            >
                              Mark as Not Present
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <Button
                              variant="outline-success"
                              className="btn-sm"
                              onClick={() =>
                                addAttendeeHandler(participant._id, record._id)
                              }
                            >
                              Mark as Present
                            </Button>
                          </td>
                          <td>
                            <i className="fa-solid fa-circle-xmark text-danger fa-3x"></i>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                });
              }
            })}

          {record &&
            record.length !== 0 &&
            record.extraParticipants.map((participant) => {
              return (
                <tr key={participant._id}>
                  <td>
                    {participant.firstName} {participant.lastName}
                  </td>
                  <td>
                    <i className="fa-solid fa-circle-check text-success fa-3x"></i>
                  </td>
                  <td>
                    {/* cancel attendee once added? Can a dd payment be cancelled? */}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>

      <Route
        render={({ history }) => (
          <SearchBox
            history={history}
            path={`/instructor/attendance/${classId}/`}
          />
        )}
      />
      {filteredMembersList.length > 0 && (
        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm text-center mt-3"
        >
          <thead>
            <tr className="text-center">
              <th>Name</th>
              <th>Add To Class</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembersList.map((member) => {
              return (
                <tr key={member._id}>
                  <td>
                    {member.firstName} {member.lastName}
                  </td>
                  <td>
                    <Button
                      variant="outline-default"
                      className="btn-sm"
                      onClick={() => addExtraAttendeeHandler(member._id)}
                    >
                      + Add to Class
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
