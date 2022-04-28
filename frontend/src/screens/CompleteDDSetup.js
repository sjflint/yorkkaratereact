import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const CompleteDDSetup = () => {
  // Redux
  const memberLogin = useSelector((state) => state.memberLogin);

  const { memberInfo } = memberLogin;

  useEffect(() => {
    if (memberInfo.ddRedirect) {
      async function ddConfirm() {
        const successURL = await axios.post("/ddroutes/setup", memberInfo);
        window.location.href = successURL.data.confirmationURL;
      }
      ddConfirm();
    }
  }, [memberInfo]);

  return (
    <div className="mt-3">
      <Loader variant="warning" />
    </div>
  );
};

export default CompleteDDSetup;
