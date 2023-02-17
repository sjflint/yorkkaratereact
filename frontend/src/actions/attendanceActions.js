import axios from "axios";
import {
  ATTENDANCE_LIST_REQUEST,
  ATTENDANCE_LIST_SUCCESS,
  ATTENDANCE_LIST_FAIL,
  ATTENDANCE_REMOVE_REQUEST,
  ATTENDANCE_REMOVE_SUCCESS,
  ATTENDANCE_REMOVE_FAIL,
  ATTENDANCE_ADD_REQUEST,
  ATTENDANCE_ADD_SUCCESS,
  ATTENDANCE_ADD_FAIL,
  ATTENDANCE_ADD_EXTRA_REQUEST,
  ATTENDANCE_ADD_EXTRA_SUCCESS,
  ATTENDANCE_ADD_EXTRA_FAIL,
  ATTENDANCE_MEMBER_LIST_REQUEST,
  ATTENDANCE_MEMBER_LIST_SUCCESS,
  ATTENDANCE_MEMBER_LIST_FAIL,
} from "../constants/attendanceConstants";

export const updateAttendance =
  (classId, date) => async (dispatch, getState) => {
    console.log(date);
    try {
      dispatch({
        type: ATTENDANCE_LIST_REQUEST,
      });

      const values = {
        // don't set date here but on the attendance screen. Validation that the date is not set for the future. Start here!!!
        // date: new Date().toDateString(),
        date: new Date(date).toDateString(),
        name: classId,
      };

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const { data } = await axios.post(`/api/attendance`, values, config);
      dispatch({
        type: ATTENDANCE_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ATTENDANCE_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
export const listMemberAttendance =
  (id, numRecord) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ATTENDANCE_MEMBER_LIST_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/attendance/${id}/${numRecord}`,
        config
      );

      dispatch({
        type: ATTENDANCE_MEMBER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ATTENDANCE_MEMBER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const attendeeRemove = (id, classId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ATTENDANCE_REMOVE_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const values = {
      id: id,
      classId: classId,
    };

    await axios.post(`/api/attendance/remove`, values, config);

    dispatch({
      type: ATTENDANCE_REMOVE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: ATTENDANCE_REMOVE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const attendeeAdd =
  (id, classId, addRemove) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ATTENDANCE_ADD_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const values = {
        id: id,
        classId: classId,
        addRemove: addRemove,
      };

      const { data } = await axios.post(`/api/attendance/add`, values, config);

      dispatch({
        type: ATTENDANCE_ADD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ATTENDANCE_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const attendeeExtraAdd =
  (memberId, recordId) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ATTENDANCE_ADD_EXTRA_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const values = {
        memberId: memberId,
        recordId: recordId,
      };

      await axios.post(`/api/attendance/addextra`, values, config);

      dispatch({
        type: ATTENDANCE_ADD_EXTRA_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ATTENDANCE_ADD_EXTRA_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
