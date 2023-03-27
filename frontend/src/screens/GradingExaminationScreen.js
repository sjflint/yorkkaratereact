import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listGrading } from "../actions/gradingActions";
import Loader from "../components/Loader";

const GradingExaminationScreen = ({ history, match }) => {
  const [gradeSelected, setGradeSelected] = useState(16);
  const [loading, setLoading] = useState(false);
  const [resultsUpdated, setResultsUpdated] = useState(false);
  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const displayGrading = useSelector((state) => state.displayGrading);
  const { loadingGrading, error, grading } = displayGrading;

  useEffect(() => {
    if (!memberInfo || !memberInfo.isInstructor) {
      history.push(
        `/login?redirect=instructor/gradingdetails/${match.params.id}`
      );
    } else {
      dispatch(listGrading(match.params.id));
    }
  }, []);

  if (grading && grading.title) {
    grading.participants.sort((a, b) =>
      a.grade > b.grade ? -1 : b.grade < a.grade ? 1 : 0
    );
  }

  const options = [
    { label: "Please select score", value: "" },

    {
      label: "Not meeting standard",
      value: 1,
    },
    {
      label: "Below standard",
      value: 2,
    },
    {
      label: "Meeting standard",
      value: 3,
    },
    {
      label: "Above standard",
      value: 4,
    },
    {
      label: "Exceeding standard",
      value: 5,
    },
  ];

  const grades = [
    { label: " Please select grade ", value: "" },
    { label: "16th kyu", value: 16 },
    { label: "15th kyu", value: 15 },
    { label: "14th kyu", value: 14 },
    { label: "13th kyu", value: 13 },
    { label: "12th kyu", value: 12 },
    { label: "11th kyu", value: 11 },
    { label: "10th kyu", value: 10 },
    { label: "9th kyu", value: 9 },
    { label: "8th kyu", value: 8 },
    { label: "7th kyu", value: 7 },
    { label: "6th kyu", value: 6 },
    { label: "5th kyu", value: 5 },
    { label: "4th kyu", value: 4 },
    { label: "3rd kyu", value: 3 },
    { label: "2nd kyu", value: 2 },
  ];
  // get grading participants from event id in params
  // post grading result for each participant
  // show grading results

  const selectHandler = async (id, style, score, eventId) => {
    const values = {
      eventId: eventId,
      id: id,
      style: style,
      score: score,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/grading/score`, values, config);

    if (data) {
      dispatch(listGrading(match.params.id));
    }
  };

  const submitResults = async () => {
    setLoading(true);
    let finalResult = [];
    grading.participants.forEach((member) => {
      const memberResult = {
        result:
          member.kihon + member.kata + member.shobuKumite + member.kihonKumite,
        memberId: member._id,
      };
      if (memberResult.result !== 0) {
        finalResult.push(memberResult);
      }
    });
    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const values = {
      eventId: grading._id,
      confirmedResults: finalResult,
    };
    console.log(values);
    const { data } = await axios.post(`/api/grading/results`, values, config);
    console.log(`Data=${data}`);

    if (data === "results logged") {
      setLoading(false);
      setResultsUpdated(true);
    }
  };

  return (
    <div>
      <Container>
        <h5 className="my-3 border-bottom border-warning text-center">
          Participants
        </h5>
        <div className="d-flex align-items-center py-2 bg-dark">
          <h5 className="mb-0 mx-4 text-white">Select Grade Level </h5>
          <select
            value={gradeSelected}
            onChange={(e) => {
              setGradeSelected(e.target.value);
              dispatch(listGrading(match.params.id));
            }}
          >
            {grades.map((grade, index) => (
              <option value={grade.value} key={index}>
                {grade.label}
              </option>
            ))}
          </select>
        </div>

        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr className="text-center">
              <th>Name</th>
              <th>Current Grade</th>
              <th>Kihon</th>
              <th>Kata</th>
              <th>Kihon Kumite</th>
              <th>Shobu Kumite</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {grading.title &&
              grading.participants.map((member, index) => {
                return (
                  Number(member.grade) === Number(gradeSelected) && (
                    <tr key={index} className="text-center">
                      <td>
                        {" "}
                        <Link
                          to={`/admin/members/${member._id}/edit`}
                        >{`${member.firstName} ${member.lastName}`}</Link>
                      </td>

                      {member.grade === 1 ? (
                        <td>{member.grade}st kyu</td>
                      ) : member.grade === 2 ? (
                        <td>{member.grade}nd kyu</td>
                      ) : member.grade === 3 ? (
                        <td>{member.grade}rd kyu</td>
                      ) : (
                        <td>{member.grade}th kyu</td>
                      )}

                      {/* data will need to be held in the participants object and http request sent each time the data is updated */}
                      <td>
                        <select
                          value={member.kihon}
                          onChange={(e) =>
                            selectHandler(
                              member._id,
                              "kihon",
                              e.target.value,
                              grading._id
                            )
                          }
                        >
                          {options.map((option, index) => (
                            <option value={option.value} key={index}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={member.kata}
                          onChange={(e) =>
                            selectHandler(
                              member._id,
                              "kata",
                              e.target.value,
                              grading._id
                            )
                          }
                        >
                          {options.map((option, index) => (
                            <option value={option.value} key={index}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={member.kihonKumite}
                          onChange={(e) =>
                            selectHandler(
                              member._id,
                              "kihonKumite",
                              e.target.value,
                              grading._id
                            )
                          }
                        >
                          {options.map((option, index) => (
                            <option value={option.value} key={index}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={member.shobuKumite}
                          onChange={(e) =>
                            selectHandler(
                              member._id,
                              "shobuKumite",
                              e.target.value,
                              grading._id
                            )
                          }
                        >
                          {options.map((option, index) => (
                            <option value={option.value} key={index}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        {member.kihon &&
                        member.kata &&
                        member.shobuKumite &&
                        member.kihonKumite ? (
                          <>
                            {member.kihon +
                              member.kata +
                              member.kihonKumite +
                              member.shobuKumite <
                            8 ? (
                              <h6 className="text-center bg-danger p-2 text-white">
                                <i className="fa-solid fa-xmark"></i>
                                <br />
                                Fail
                              </h6>
                            ) : member.kihon +
                                member.kata +
                                member.kihonKumite +
                                member.shobuKumite <
                              10 ? (
                              <h6 className="text-center bg-warning p-2 text-white">
                                <i className="fa-solid fa-question"></i>
                                <br />
                                Conditional
                              </h6>
                            ) : member.kihon +
                                member.kata +
                                member.kihonKumite +
                                member.shobuKumite <
                              17 ? (
                              <h6 className="text-center bg-success p-2 text-white">
                                <i className="fa-solid fa-check"></i>
                                <br />
                                Pass
                              </h6>
                            ) : (
                              <h6 className="text-center bg-distinction p-2 text-white">
                                <i className="fa-solid fa-exclamation"></i>
                                <br />
                                Distinction
                              </h6>
                            )}
                          </>
                        ) : (
                          "..."
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </Table>

        {grading && loading ? (
          <Loader />
        ) : !resultsUpdated && !grading.resultsPosted ? (
          <Button onClick={() => submitResults()}>Submit Results</Button>
        ) : (
          "Results have already been submited"
        )}
      </Container>
    </div>
  );
};

export default GradingExaminationScreen;
