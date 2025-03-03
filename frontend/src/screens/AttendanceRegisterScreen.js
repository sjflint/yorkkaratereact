import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route } from "react-router-dom";
import {
  attendeeAdd,
  updateAttendance,
  attendeeExtraAdd,
} from "../actions/attendanceActions";
import { cancelPayment } from "../actions/directDebitActions";
import { changeAttRecord, membersList } from "../actions/memberActions";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";

export const AttendanceRegisterScreen = ({ history, match }) => {
  const keyword = match.params.keyword;
  const classId = match.params.className;
  const date = match.params.date;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const [stamps, setStamps] = useState([]);

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { loading, error, trainingSessions } = trainingSessionsList;

  const attendanceList = useSelector((state) => state.attendanceList);
  let {
    loading: attendanceLoading,
    error: attendanceError,
    record,
  } = attendanceList;

  const listMembers = useSelector((state) => state.listMembers);
  const {
    loading: memberListLoading,
    error: memberListError,
    memberList,
  } = listMembers;

  const addAttendee = useSelector((state) => state.addAttendee);
  const { record: updatedRecord } = addAttendee;

  useEffect(() => {
    if (!memberInfo) {
      history.push(
        `/login?redirect=instructor/attendance/${match.params.className}/search/~`
      );
    } else if (!memberInfo.isInstructor) {
      history.push("/profile");
    } else {
      dispatch(listTrainingSessions());
      dispatch(updateAttendance(classId, date));
      if (keyword) {
        dispatch(membersList(pageNumber, keyword));
      }
    }
  }, [
    dispatch,
    classId,
    keyword,
    history,
    memberInfo,
    pageNumber,
    match.params.className,
    date,
  ]);

  const removeAttendeeHandler = async (id, recordId, className) => {
    setStamps(stamps.filter((stamp) => stamp !== id));
    await dispatch(attendeeAdd(id, recordId, "remove"));
  };

  const addAttendeeHandler = async (id, recordId) => {
    setStamps([...stamps, id]);
    await dispatch(attendeeAdd(id, recordId, "add"));
  };

  const removeTrialAttendeeHandler = async (id, recordId, className) => {
    await dispatch(attendeeAdd(id, recordId, "remove"));
    // await dispatch(updateAttendance(classId, date));
    window.location.reload();
  };

  const addTrialAttendeeHandler = async (id, recordId, className) => {
    await dispatch(attendeeAdd(id, recordId, "add"));
    // await dispatch(updateAttendance(classId, date));
    window.location.reload();
  };

  const addExtraAttendeeHandler = async (memberId) => {
    await dispatch(attendeeExtraAdd(memberId, record._id));
    await dispatch(updateAttendance(classId, date));
    history.push(`instructor/attendance/${classId}`);
    window.location.reload();
  };

  let filteredMembersList = [];
  let participantsArray = [];
  let newArray = [];

  if (trainingSessions) {
    trainingSessions.forEach((trainingSession) => {
      // build array of participant id's
      if (trainingSession._id === classId) {
        trainingSession.participants.forEach((id) => {
          participantsArray.push(id._id);
          newArray.push(id);
        });
        trainingSession.trialParticipants.forEach((id) => {
          participantsArray.push(id._id);
          !newArray.includes(id) && newArray.push(id);
        });
        trainingSession.participants = newArray;
      }
    });
  }

  const filterSearches = async () => {
    // check if extra participants have been added
    if (record && record.length !== 0) {
      record.extraParticipants.forEach((participant) => {
        participantsArray.push(participant._id);
      });
    }

    if (trainingSessions) {
      trainingSessions.forEach((trainingSession) => {
        // find suitable members from search list
        if (memberList && trainingSession._id === classId) {
          memberList.forEach((member) => {
            
            if (
              member.kyuGrade <= trainingSession.minGradeLevel &&
              member.kyuGrade >= trainingSession.maxGradeLevel &&
              member.ddsuccess === true
            ) {
              if (participantsArray.includes(member._id)) {
                console.log("already attending");
              } else if (filteredMembersList.length !== 0) {
                filteredMembersList.forEach((filteredMember) => {
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

  if (updatedRecord) {
    record = updatedRecord;
  }

  return (
    <Container className="mt-3">
      {error && <Message variant="danger">{error}</Message>}
      {memberListError && <Message variant="danger">{memberListError}</Message>}
      {attendanceError && <Message variant="danger">{attendanceError}</Message>}
      <Link
        className="btn btn-outline-secondary py-0"
        to="/instructor/attendance"
      >
        <i className="fas fa-arrow-left"></i> Return To Attendance Screen
      </Link>
      {trainingSessions &&
        trainingSessions.forEach((trainingSession) => {
          if (trainingSession._id === classId) {
            return (
              <h5 className="text-center mt-3 mb-1">{trainingSession.name}</h5>
            );
          }
        })}
      {(loading || attendanceLoading || memberListLoading) && (
        <Loader variant="warning" />
      )}

      <div className="bg-black p-3 mt-2">
        <p className="mt-1 mb-1 text-white">+ additional members</p>
        <Route
          render={({ history }) => (
            <SearchBox
              history={history}
              path={`/instructor/attendance/${classId}/${date}/`}
            />
          )}
        />

        {filteredMembersList.length > 0 && (
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center mt-3 text-white"
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
                    <td className="text-white">
                      {member.firstName} {member.lastName}
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        className="btn-sm"
                        onClick={() => addExtraAttendeeHandler(member._id)}
                      >
                        + Add to Class
                      </Button>
                      {/* <Button
                      variant="outline-success"
                      className="btn-sm"
                      onClick={() => {
                        const id = { memberId: member._id, classId: classId };
                        dispatch(addMyClass(id));
                      }}
                    >
                      + Add to Class
                    </Button> */}
                      {/* can be used to add members via admin register screen if needed */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>

      <div>
        <Table
          striped
          bordered
          hover
          responsive
          className="table-sm text-center mt-3"
        >
          <thead>
            <tr className="text-center">
              <th>Stamps</th>
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
                    if (participant.dateOfBirth) {
                      return (
                        <tr key={participant._id}>
                          <td>
                            {stamps.includes(participant._id) ? (
                              <p className="border border-danger rounded-circle max-width-30 mx-auto bg-danger text-white">
                                {participant.attendanceRecord + 1}
                              </p>
                            ) : (
                              <p className="border border-danger rounded-circle max-width-30 mx-auto bg-danger text-white">
                                {participant.attendanceRecord}
                              </p>
                            )}
                          </td>
                          <td>
                            <Link to={`/admin/members/${participant._id}/edit`}>
                              {participant.firstName} {participant.lastName}{" "}
                              {participant.medicalStatus === "Yes medical" && (
                                <i className="fa-solid fa-briefcase-medical text-danger fa-2x"></i>
                              )}
                            </Link>
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
                                  onClick={() => {
                                    addAttendeeHandler(
                                      participant._id,
                                      record._id
                                    );
                                  }}
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
                    } else {
                      return (
                        <tr key={participant._id}>
                          <td></td>
                          <td>
                            {participant.firstName} {participant.lastName}{" "}
                            {participant.medicalStatus === "Yes medical" && (
                              <i className="fa-solid fa-briefcase-medical text-danger fa-2x"></i>
                            )}
                            <br />
                            (Trial)
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
                                    removeTrialAttendeeHandler(
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
                                    addTrialAttendeeHandler(
                                      participant._id,
                                      record._id
                                    )
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
                    }
                  });
                } else {
                  return null;
                }
              })}

            {record &&
              record.length !== 0 &&
              record.extraParticipants &&
              record.extraParticipants.map((participant) => {
                return (
                  <tr key={participant._id}>
                    <td>
                      {stamps.includes(participant._id) ? (
                        <p className="border border-danger rounded-circle max-width-30 mx-auto bg-danger text-white">
                          {participant.attendanceRecord + 1}
                        </p>
                      ) : (
                        <p className="border border-danger rounded-circle max-width-30 mx-auto bg-danger text-white">
                          {participant.attendanceRecord}
                        </p>
                      )}
                    </td>
                    <td>
                      <Link to={`/admin/members/${participant._id}/edit`}>
                        {participant.firstName} {participant.lastName}{" "}
                        {participant.medicalStatus === "Yes medical" && (
                          <i className="fa-solid fa-briefcase-medical text-danger fa-2x"></i>
                        )}
                      </Link>
                    </td>
                    <td>
                      <i className="fa-solid fa-circle-check text-success fa-3x"></i>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        className="btn-sm"
                        onClick={async () => {
                          await dispatch(
                            cancelPayment(participant._id, record._id)
                          );
                          await dispatch(updateAttendance(classId, date));
                        }}
                      >
                        Mark as Not Present
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};
