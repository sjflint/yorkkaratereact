import axios from "axios";
import {
  BLACKBELT_LIST_FAIL,
  BLACKBELT_LIST_REQUEST,
  BLACKBELT_LIST_SUCCESS,
  EDIT_MEMBER_FAIL,
  EDIT_MEMBER_REQUEST,
  EDIT_MEMBER_SUCCESS,
  FORMER_BLACKBELT_LIST_FAIL,
  FORMER_BLACKBELT_LIST_REQUEST,
  FORMER_BLACKBELT_LIST_SUCCESS,
  LIST_MEMBERS_FAIL,
  LIST_MEMBERS_REQUEST,
  LIST_MEMBERS_RESET,
  LIST_MEMBERS_SUCCESS,
  LIST_WELFARE_MEMBER_FAIL,
  LIST_WELFARE_MEMBER_REQUEST,
  LIST_WELFARE_MEMBER_SUCCESS,
  LIST_WELFARE_PUBLIC_FAIL,
  LIST_WELFARE_PUBLIC_REQUEST,
  LIST_WELFARE_PUBLIC_SUCCESS,
  MEMBER_DELETE_FAIL,
  MEMBER_DELETE_REQUEST,
  MEMBER_DELETE_SUCCESS,
  MEMBER_DETAILS_FAIL,
  MEMBER_DETAILS_REQUEST,
  MEMBER_DETAILS_SUCCESS,
  MEMBER_LOGIN_FAIL,
  MEMBER_LOGIN_REQUEST,
  MEMBER_LOGIN_SUCCESS,
  MEMBER_LOGOUT,
  MEMBER_PUBLIC_DETAILS_FAIL,
  MEMBER_PUBLIC_DETAILS_REQUEST,
  MEMBER_PUBLIC_DETAILS_SUCCESS,
  MEMBER_REGISTER_FAIL,
  MEMBER_REGISTER_REQUEST,
  MEMBER_REGISTER_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "../constants/memberConstants";

export const login = (values) => async (dispatch) => {
  try {
    dispatch({
      type: MEMBER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/members/login", values, config);

    dispatch({
      type: MEMBER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("memberInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: MEMBER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("memberInfo");
  dispatch({ type: MEMBER_LOGOUT });
  dispatch({ type: LIST_MEMBERS_RESET });
  window.location.href = "/";
};

export const register = (values) => async (dispatch) => {
  try {
    dispatch({
      type: MEMBER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post("/api/members", values, config);

    dispatch({
      type: MEMBER_REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: MEMBER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("memberInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: MEMBER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getMemberDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: MEMBER_DETAILS_REQUEST,
    });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/members/${id}`, config);

    dispatch({
      type: MEMBER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEMBER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getPublicMemberDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: MEMBER_PUBLIC_DETAILS_REQUEST,
    });

    const { data } = await axios.get(`/api/members/public/${id}`);

    dispatch({
      type: MEMBER_PUBLIC_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MEMBER_PUBLIC_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listBlackBelts = () => async (dispatch) => {
  try {
    dispatch({ type: BLACKBELT_LIST_REQUEST });

    const { data } = await axios.get("/api/members/blackbelts");

    dispatch({
      type: BLACKBELT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BLACKBELT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listPublicWelfareMembers = () => async (dispatch) => {
  try {
    dispatch({ type: LIST_WELFARE_PUBLIC_REQUEST });

    const { data } = await axios.get("/api/members/publicwelfarelist");

    dispatch({
      type: LIST_WELFARE_PUBLIC_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIST_WELFARE_PUBLIC_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMemberWelfareMembers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LIST_WELFARE_MEMBER_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/members/memberwelfarelist", config);

    dispatch({
      type: LIST_WELFARE_MEMBER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: LIST_WELFARE_MEMBER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listFormerBlackBelts = () => async (dispatch) => {
  try {
    dispatch({ type: FORMER_BLACKBELT_LIST_REQUEST });

    const { data } = await axios.get("/api/members/formerblackbelts");

    dispatch({
      type: FORMER_BLACKBELT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FORMER_BLACKBELT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const membersList =
  (pageNumber = "", keyword = "") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: LIST_MEMBERS_REQUEST });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/members?pageNumber=${pageNumber}&keyword=${keyword}`,
        config
      );

      dispatch({
        type: LIST_MEMBERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LIST_MEMBERS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteMember = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: MEMBER_DELETE_REQUEST });

    const {
      memberLogin: { memberInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${memberInfo.token}`,
      },
    };

    await axios.delete(`/api/members/${id}`, config);

    dispatch({
      type: MEMBER_DELETE_SUCCESS,
    });
    dispatch(membersList());
  } catch (error) {
    dispatch({
      type: MEMBER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProfile =
  ({ ...values }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_PROFILE_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/members/updateprofile",
        { values },
        config
      );

      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updatePassword =
  ({ ...passwordValues }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: UPDATE_PASSWORD_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/members/updatePassword",
        { passwordValues },
        config
      );

      dispatch({
        type: UPDATE_PASSWORD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const passwordReset = (values) => async (dispatch) => {
  try {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/members/resetPassword",
      { values },
      config
    );

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const editMember =
  ({ ...values }) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: EDIT_MEMBER_REQUEST,
      });

      const {
        memberLogin: { memberInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${memberInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/members/${values.memberId}`,
        { values },
        config
      );

      dispatch({
        type: EDIT_MEMBER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: EDIT_MEMBER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
