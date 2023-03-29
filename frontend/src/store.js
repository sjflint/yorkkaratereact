import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  articleCreateReducer,
  articleDeleteReducer,
  articleListReducer,
  articleUpdateReducer,
  displayArticleReducer,
} from "./reducers/articleReducers";
import {
  trainingVideoListReducer,
  displayTrainingVideoReducer,
  trainingVideoDeleteReducer,
  trainingVideoCreateReducer,
  trainingVideoUpdateReducer,
  trainingVideoListByGradeReducer,
} from "./reducers/trainingVideoReducers";
import {
  memberLoginReducer,
  memberRegisterReducer,
  blackBeltListReducer,
  listMembersReducer,
  memberDetailsReducer,
  updateProfileReducer,
  updatePasswordReducer,
  memberDeleteReducer,
  memberEditReducer,
  resetPasswordReducer,
  memberPublicDetailsReducer,
  formerBlackBeltListReducer,
  welfareMemberPublicReducer,
  welfareMemberReducer,
  memberAttRecordReducer,
} from "./reducers/memberReducer";
import {
  productListReducer,
  displayProductReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
} from "./reducers/productReducer";
import {
  AddClassListReducer,
  deleteClassListReducer,
  listTrainingSessionsReducer,
  memberClassListReducer,
  myClassListReducer,
  switchClassListReducer,
  trainingSessionByIdReducer,
  trainingSessionCancelReducer,
  trainingSessionCreateReducer,
  trainingSessionDeleteReducer,
  trainingSessionUpdateReducer,
  waitingListReducer,
} from "./reducers/trainingSessionReducer";
import { basketReducer } from "./reducers/basketReducers";
import {
  eventListReducer,
  displayEventReducer,
  eventDeleteReducer,
  eventCreateReducer,
  eventUpdateReducer,
} from "./reducers/eventReducer";
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrderListReducer,
  orderListReducer,
  orderDeliverReducer,
  orderFulfilReducer,
} from "./reducers/orderReducers";
import {
  cancelDirectDebitReducer,
  cancelPaymentReducer,
  createDDPaymentReducer,
  updateDirectDebitReducer,
  updateSubscriptionReducer,
} from "./reducers/directDebitReducers";
import {
  uploadFileReducer,
  uploadImgReducer,
  uploadVideoReducer,
} from "./reducers/uploadFileReducer";
import {
  displayLessonPlanReducer,
  lessonPlanCreateReducer,
  lessonPlanDeleteReducer,
  lessonPlanListReducer,
  lessonPlanUpdateReducer,
} from "./reducers/lessonPlanReducer";
import {
  displayGradingReducer,
  listGradingResultsReducer,
} from "./reducers/gradingReducer";
import {
  addAttendeeReducer,
  addExtraAttendeeReducer,
  attendanceListReducer,
  memberAttendanceListReducer,
  removeAttendeeReducer,
} from "./reducers/attendanceReducer";
import {
  financialListReducer,
  financialUpdateReducer,
  monthlyCostDeleteReducer,
  monthlyCostListReducer,
  monthlyCostUpdateReducer,
} from "./reducers/financialReducers";
import { sendEmailReducer } from "./reducers/emailReducer";
import {
  trialGetReducer,
  trialListReducer,
  trialPayReducer,
  trialRegisterReducer,
} from "./reducers/trialRegisterReducers";
import { enquiryListReducer } from "./reducers/enquiryReducer";

const reducer = combineReducers({
  attendanceList: attendanceListReducer,
  memberAttendanceList: memberAttendanceListReducer,
  removeAttendee: removeAttendeeReducer,
  addAttendee: addAttendeeReducer,
  addExtraAttendee: addExtraAttendeeReducer,
  articleList: articleListReducer,
  articleDelete: articleDeleteReducer,
  articleCreate: articleCreateReducer,
  articleUpdate: articleUpdateReducer,
  displayArticle: displayArticleReducer,
  trainingVideoList: trainingVideoListReducer,
  trainingVideoListByGrade: trainingVideoListByGradeReducer,
  displayTrainingVideo: displayTrainingVideoReducer,
  trainingVideoDelete: trainingVideoDeleteReducer,
  trainingVideoCreate: trainingVideoCreateReducer,
  trainingVideoUpdate: trainingVideoUpdateReducer,
  displayGrading: displayGradingReducer,
  listGradingResults: listGradingResultsReducer,
  lessonPlanList: lessonPlanListReducer,
  displayLessonPlan: displayLessonPlanReducer,
  lessonPlanDelete: lessonPlanDeleteReducer,
  lessonPlanCreate: lessonPlanCreateReducer,
  lessonPlanUpdate: lessonPlanUpdateReducer,
  memberLogin: memberLoginReducer,
  memberRegister: memberRegisterReducer,
  memberDetails: memberDetailsReducer,
  memberPublicDetails: memberPublicDetailsReducer,
  listMembers: listMembersReducer,
  welfareMemberPublic: welfareMemberPublicReducer,
  welfareMember: welfareMemberReducer,
  memberDelete: memberDeleteReducer,
  memberEdit: memberEditReducer,
  memberAttRecord: memberAttRecordReducer,
  updateProfileDetails: updateProfileReducer,
  updatePassword: updatePasswordReducer,
  resetPassword: resetPasswordReducer,
  trainingSessionsList: listTrainingSessionsReducer,
  trainingSessionByID: trainingSessionByIdReducer,
  trainingSessionDelete: trainingSessionDeleteReducer,
  trainingSessionCreate: trainingSessionCreateReducer,
  trainingSessionUpdate: trainingSessionUpdateReducer,
  trainingSessionCancel: trainingSessionCancelReducer,
  myClassList: myClassListReducer,
  memberClassList: memberClassListReducer,
  addClassList: AddClassListReducer,
  deleteClassList: deleteClassListReducer,
  switchClassList: switchClassListReducer,
  blackBeltList: blackBeltListReducer,
  formerBlackBeltList: formerBlackBeltListReducer,
  productList: productListReducer,
  displayProduct: displayProductReducer,
  basket: basketReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  eventList: eventListReducer,
  eventDelete: eventDeleteReducer,
  eventCreate: eventCreateReducer,
  eventUpdate: eventUpdateReducer,
  displayEvent: displayEventReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderFulfil: orderFulfilReducer,
  myOrderList: myOrderListReducer,
  orderList: orderListReducer,
  updateDirectDebit: updateDirectDebitReducer,
  cancelDirectDebit: cancelDirectDebitReducer,
  updateSubscription: updateSubscriptionReducer,
  createDDPayment: createDDPaymentReducer,
  cancelPayment: cancelPaymentReducer,
  uploadImg: uploadImgReducer,
  uploadVid: uploadVideoReducer,
  uploadCurrFile: uploadFileReducer,
  financialList: financialListReducer,
  financialUpdate: financialUpdateReducer,
  monthlyCostList: monthlyCostListReducer,
  monthlyCostUpdate: monthlyCostUpdateReducer,
  monthlyCostDelete: monthlyCostDeleteReducer,
  sendEmail: sendEmailReducer,
  trialRegister: trialRegisterReducer,
  trialGet: trialGetReducer,
  trialPay: trialPayReducer,
  trialList: trialListReducer,
  enquiryList: enquiryListReducer,
  waitingList: waitingListReducer,
});

const memberInfoFromStorage = localStorage.getItem("memberInfo")
  ? JSON.parse(localStorage.getItem("memberInfo"))
  : null;

const updateDDFromStorage = localStorage.getItem("updateDD")
  ? JSON.parse(localStorage.getItem("updateDD"))
  : null;

const basketItemsFromStorage = localStorage.getItem("basketItems")
  ? JSON.parse(localStorage.getItem("basketItems"))
  : [];

const paymentMethodFromStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : "PayPal";

const initialState = {
  memberLogin: { memberInfo: memberInfoFromStorage },
  updateDirectDebit: { ddSetupInfo: updateDDFromStorage },
  basket: {
    basketItems: basketItemsFromStorage,
    paymentMethod: paymentMethodFromStorage,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
