import {
  BLACKBELT_LIST_FAIL,
  BLACKBELT_LIST_REQUEST,
  BLACKBELT_LIST_SUCCESS,
  EDIT_MEMBER_FAIL,
  EDIT_MEMBER_REQUEST,
  EDIT_MEMBER_RESET,
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
  LIST_WELFARE_PUBLIC_CLEAR,
  LIST_WELFARE_PUBLIC_FAIL,
  LIST_WELFARE_PUBLIC_REQUEST,
  LIST_WELFARE_PUBLIC_SUCCESS,
  MEMBER_ATTRECORD_FAIL,
  MEMBER_ATTRECORD_REQUEST,
  MEMBER_ATTRECORD_SUCCESS,
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

export const memberLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case MEMBER_LOGIN_REQUEST:
      return { loading: true };
    case MEMBER_LOGIN_SUCCESS:
      return { loading: false, memberInfo: action.payload };
    case MEMBER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case MEMBER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const memberRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case MEMBER_REGISTER_REQUEST:
      return { loading: true };
    case MEMBER_REGISTER_SUCCESS:
      return { loading: false, memberInfo: action.payload };
    case MEMBER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const memberDetailsReducer = (state = { member: {} }, action) => {
  switch (action.type) {
    case MEMBER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case MEMBER_DETAILS_SUCCESS:
      return { loading: false, member: action.payload };
    case MEMBER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const memberPublicDetailsReducer = (state = { member: {} }, action) => {
  switch (action.type) {
    case MEMBER_PUBLIC_DETAILS_REQUEST:
      return { ...state, loading: true };
    case MEMBER_PUBLIC_DETAILS_SUCCESS:
      return { loading: false, member: action.payload };
    case MEMBER_PUBLIC_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const blackBeltListReducer = (state = { blackBelts: [] }, action) => {
  switch (action.type) {
    case BLACKBELT_LIST_REQUEST:
      return { loading: true, BlackBelts: [] };
    case BLACKBELT_LIST_SUCCESS:
      return { loading: false, blackBelts: action.payload };
    case BLACKBELT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const formerBlackBeltListReducer = (
  state = { formerBlackBelts: [] },
  action
) => {
  switch (action.type) {
    case FORMER_BLACKBELT_LIST_REQUEST:
      return { loading: true, formerBlackBelts: [] };
    case FORMER_BLACKBELT_LIST_SUCCESS:
      return { loading: false, formerBlackBelts: action.payload };
    case FORMER_BLACKBELT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const updateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true };
    case UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const updatePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PASSWORD_REQUEST:
      return { loading: true };
    case UPDATE_PASSWORD_SUCCESS:
      return { loading: false, success: true };
    case UPDATE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const resetPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return { loading: true };
    case RESET_PASSWORD_SUCCESS:
      return { loading: false, success: true };
    case RESET_PASSWORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const listMembersReducer = (state = { memberList: [] }, action) => {
  switch (action.type) {
    case LIST_MEMBERS_REQUEST:
      return { loading: true };
    case LIST_MEMBERS_SUCCESS:
      return {
        loading: false,
        memberList: action.payload.members,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case LIST_MEMBERS_FAIL:
      return { loading: false, error: action.payload };
    case LIST_MEMBERS_RESET:
      return { memberList: [] };
    default:
      return state;
  }
};

export const memberDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case MEMBER_DELETE_REQUEST:
      return { loading: true };
    case MEMBER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case MEMBER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const memberEditReducer = (state = {}, action) => {
  switch (action.type) {
    case EDIT_MEMBER_REQUEST:
      return { loading: true };
    case EDIT_MEMBER_SUCCESS:
      return { loading: false, success: true };
    case EDIT_MEMBER_FAIL:
      return { loading: false, error: action.payload };
    case EDIT_MEMBER_RESET:
      return {};
    default:
      return state;
  }
};

export const welfareMemberPublicReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_WELFARE_PUBLIC_REQUEST:
      return { loading: true };
    case LIST_WELFARE_PUBLIC_SUCCESS:
      return { loading: false, welfarePublicList: action.payload };
    case LIST_WELFARE_PUBLIC_FAIL:
      return { loading: false, error: action.payload };
    case LIST_WELFARE_PUBLIC_CLEAR:
      return {};
    default:
      return state;
  }
};

export const welfareMemberReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_WELFARE_MEMBER_REQUEST:
      return { loading: true };
    case LIST_WELFARE_MEMBER_SUCCESS:
      return { loading: false, welfareMemberList: action.payload };
    case LIST_WELFARE_MEMBER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const memberAttRecordReducer = (state = {}, action) => {
  switch (action.type) {
    case MEMBER_ATTRECORD_REQUEST:
      return { loading: true };
    case MEMBER_ATTRECORD_SUCCESS:
      return { loading: false, success: true };
    case MEMBER_ATTRECORD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
