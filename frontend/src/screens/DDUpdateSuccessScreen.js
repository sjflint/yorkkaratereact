import { useSelector } from "react-redux";

const DDUpdateSuccessScreen = () => {
  localStorage.removeItem("updateDD");

  const directDebit = useSelector((state) => state.updateDirectDebit);
  const { ddSetupInfo } = directDebit;

  if (ddSetupInfo) {
    window.location.reload();
  }

  return <div></div>;
};

export default DDUpdateSuccessScreen;
