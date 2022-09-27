import {
  ENQUIRY_LIST_FAIL,
  ENQUIRY_LIST_REQUEST,
  ENQUIRY_LIST_SUCCESS,
} from "../constants/enquiryConstants";

export const enquiryListReducer = (state = { enquiries: [] }, action) => {
  switch (action.type) {
    case ENQUIRY_LIST_REQUEST:
      return { loading: true, enquiries: [] };
    case ENQUIRY_LIST_SUCCESS:
      return {
        loading: false,
        enquiries: action.payload,
      };
    case ENQUIRY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
