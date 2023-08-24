import { useEffect, useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listMemberAttendance } from "../actions/attendanceActions";
import { ATTENDANCE_MEMBER_LIST_RESET } from "../constants/attendanceConstants";
import Loader from "./Loader";
import Message from "./Message";

const AttRecord = ({ id }) => {
  const dispatch = useDispatch();

  const [numRecords, setNumRecords] = useState(-5);

  const memberAttendanceList = useSelector(
    (state) => state.memberAttendanceList
  );
  const { loading, error, record } = memberAttendanceList;

  useEffect(() => {
    if (!record) {
      dispatch(listMemberAttendance(id, numRecords));
    }
  });

  const options = [
    { value: -5, label: "last 5 records" },
    { value: -10, label: "last 10 records" },
    { value: -20, label: "last 20 records" },
    { value: -50, label: "last 50 records" },
    { value: -100, label: "last 100 records" },
  ];

  return (
    <>
      {loading && <Loader variant="warning" />}
      {error && <Message variant="warning">{error}</Message>}
      <>
        <div className="mb-2 pb-2 border-bottom border-warning">
          <Form.Select
            onChange={async (e) => {
              await setNumRecords(e.target.value);
              dispatch(listMemberAttendance(id, e.target.value));
            }}
          >
            {options.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </Form.Select>
        </div>
        <ListGroup>
          {record && typeof record !== "string" ? (
            record.map((classItem, index) => {
              return (
                <>
                  <ListGroup.Item key={index} className="bg-grey">
                    Date: {new Date(classItem.date).toLocaleDateString("en-GB")}
                  </ListGroup.Item>
                  <ListGroup.Item>{classItem.class}</ListGroup.Item>
                </>
              );
            })
          ) : (
            <h5 className="text-white bg-warning text-center p-2">
              No records to show
            </h5>
          )}
        </ListGroup>
      </>
    </>
  );
};

export default AttRecord;
