import { Route } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import NewsScreen from "./NewsScreen";
import ArticleScreen from "./ArticleScreen";
import AboutScreen from "./AboutScreen";
import LoginScreen from "./LoginScreen";
import AccountResetScreen from "./AccountResetScreen";
import RegisterScreen from "./RegisterScreen";
import ContactScreen from "./ContactScreen";
import AgeGroupsScreen from "./AgeGroupsScreen";
import VenuesScreen from "./VenuesScreen";
import TimetableScreen from "./TimetableScreen";
import CompleteDDSetup from "./CompleteDDSetup";
import CompleteUpdateDD from "./CompleteUpdateDD";
import AfterSchoolScreen from "./AfterSchoolScreen";
import MemberApplicationScreen from "./memberApplicationScreen";
import WelfareFundraisingScreen from "./WelfareFundraisingScreen";
import BlackBeltScreen from "./BlackBeltsScreen";
import ShopScreen from "./ShopScreen";
import ProductScreen from "./ProductScreen";
import BasketScreen from "./BasketScreen";
import EventsScreen from "./EventsScreen";
import EventScreen from "./EventScreen";
import PaymentScreen from "./PaymentScreen";
import PlaceOrderScreen from "./PlaceOrderScreen";
import OrderScreen from "./OrderScreen";
import ProfileScreen from "./ProfileScreen";
import DDUpdateSuccessScreen from "./DDUpdateSuccessScreen";
import ddsuccessScreen from "./ddsuccessScreen";
import TrainingVideoScreen from "./TrainingVideoScreen";
import MembershipCancelledScreen from "./MembershipCancelledScreen";
import AdminScreen from "./AdminScreen";
import ListMembersScreen from "./ListMembersScreen";
import MemberEditScreen from "./MemberEditScreen";
import ListEventsScreen from "./ListEventsScreen";

const ScreenRoutes = () => {
  return (
    <>
      <Route path="/" component={HomeScreen} exact />
      <Route path="/home" component={HomeScreen} />
      <Route path="/news" component={NewsScreen} />
      <Route path="/article/:id" component={ArticleScreen} />
      <Route path="/products/:id" component={ProductScreen} />
      <Route path="/trainingvideos/:id" component={TrainingVideoScreen} />
      <Route path="/about" component={AboutScreen} />
      <Route path="/login" component={LoginScreen} />
      <Route path="/reset-account" component={AccountResetScreen} />
      <Route path="/ddupdatesuccess" component={DDUpdateSuccessScreen} />
      <Route path="/ddsuccess" component={ddsuccessScreen} />
      <Route
        path="/membershipcancelled"
        component={MembershipCancelledScreen}
      />
      <Route path="/register" component={RegisterScreen} />
      <Route path="/contact" component={ContactScreen} />
      <Route path="/agegroups" component={AgeGroupsScreen} />
      <Route path="/venues" component={VenuesScreen} />
      <Route path="/timetable" component={TimetableScreen} />
      <Route path="/completeddsetup" component={CompleteDDSetup} />
      <Route path="/completeupdatedd" component={CompleteUpdateDD} />
      <Route path="/afterschool" component={AfterSchoolScreen} />
      <Route path="/memberapplication" component={MemberApplicationScreen} />
      <Route
        path="/welfareandfundraising"
        component={WelfareFundraisingScreen}
      />
      <Route path="/blackbelts" component={BlackBeltScreen} />
      <Route path="/shop" component={ShopScreen} />
      <Route path="/basket/:id?" component={BasketScreen} />
      <Route path="/events" component={EventsScreen} />
      <Route path="/event/:id" component={EventScreen} />
      <Route path="/payment" component={PaymentScreen} />
      <Route path="/placeorder" component={PlaceOrderScreen} />
      <Route path="/order/:id" component={OrderScreen} />
      <Route path="/profile" component={ProfileScreen} />
      <Route path="/admin" component={AdminScreen} exact />
      <Route path="/admin/listmembers" component={ListMembersScreen} />
      <Route path="/admin/listevents" component={ListEventsScreen} />
      <Route path="/admin/members/:id/edit" component={MemberEditScreen} />
    </>
  );
};

export default ScreenRoutes;
