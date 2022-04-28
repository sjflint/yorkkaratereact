import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLocation } from "react-router-dom";

const CompleteUpdateDD = () => {
  const search = useLocation().search;
  const flowId = new URLSearchParams(search).get("redirect_flow_id");
  const token = new URLSearchParams(search).get("token");

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  useEffect(() => {
    if (flowId && token && member._id) {
      const ddSetupInfo = {
        _id: member._id,
        session_token: token,
        ddRedirect: flowId,
      };

      const ddUpdate = async () => {
        await axios
          .post("/ddroutes/updatedirectdebit", ddSetupInfo)
          .then((resp) => {
            console.log(resp.data);
            window.location.href = resp.data.confirmationURL;
          });
      };
      ddUpdate();
    }
  }, [flowId, member, token]);

  return (
    <div className="mt-3">
      <Loader variant="warning" />
    </div>
  );
};

export default CompleteUpdateDD;
