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
} from "./reducers/memberReducer";
import {
  productListReducer,
  displayProductReducer,
} from "./reducers/productReducer";
import {
  AddClassListReducer,
  deleteClassListReducer,
  memberClassListReducer,
  myClassListReducer,
  switchClassListReducer,
  trainingSessionReducer,
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
} from "./reducers/orderReducers";
import {
  cancelDirectDebitReducer,
  createDDPaymentReducer,
  updateDirectDebitReducer,
  updateSubscriptionReducer,
} from "./reducers/directDebitReducers";
import { uploadImgReducer } from "./reducers/uploadImageReducer";

const reducer = combineReducers({
  articleList: articleListReducer,
  articleDelete: articleDeleteReducer,
  articleCreate: articleCreateReducer,
  articleUpdate: articleUpdateReducer,
  displayArticle: displayArticleReducer,
  trainingVideoList: trainingVideoListReducer,
  displayTrainingVideo: displayTrainingVideoReducer,
  memberLogin: memberLoginReducer,
  memberRegister: memberRegisterReducer,
  memberDetails: memberDetailsReducer,
  listMembers: listMembersReducer,
  memberDelete: memberDeleteReducer,
  memberEdit: memberEditReducer,
  updateProfile: updateProfileReducer,
  updatePassword: updatePasswordReducer,
  trainingSession: trainingSessionReducer,
  myClassList: myClassListReducer,
  memberClassList: memberClassListReducer,
  addClassList: AddClassListReducer,
  deleteClassList: deleteClassListReducer,
  switchClassList: switchClassListReducer,
  blackBeltList: blackBeltListReducer,
  productList: productListReducer,
  displayProduct: displayProductReducer,
  basket: basketReducer,
  eventList: eventListReducer,
  eventDelete: eventDeleteReducer,
  eventCreate: eventCreateReducer,
  eventUpdate: eventUpdateReducer,
  displayEvent: displayEventReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  myOrderList: myOrderListReducer,
  updateDirectDebit: updateDirectDebitReducer,
  cancelDirectDebit: cancelDirectDebitReducer,
  updateSubscription: updateSubscriptionReducer,
  createDDPayment: createDDPaymentReducer,
  uploadImg: uploadImgReducer,
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
