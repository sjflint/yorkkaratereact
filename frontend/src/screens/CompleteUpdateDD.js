import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const CompleteUpdateDD = () => {
  // Redux
  const updateDirectDebit = useSelector((state) => state.updateDirectDebit);
  const { ddSetupInfo } = updateDirectDebit;

  console.log(ddSetupInfo);

  useEffect(() => {
    if (ddSetupInfo.ddRedirect) {
      async function ddUpdate() {
        const successURL = await axios.post(
          "/ddroutes/updatedirectdebit",
          ddSetupInfo
        );
        window.location.href = successURL.data.confirmationURL;
      }
      ddUpdate();
    }
  }, [ddSetupInfo]);

  return (
    <div>
      <Loader variant="warning" />
    </div>
  );
};

export default CompleteUpdateDD;
