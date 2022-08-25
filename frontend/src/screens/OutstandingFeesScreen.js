import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMemberDetails, updateProfile } from "../actions/memberActions";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";
import Loader from "../components/Loader";
import { Container } from "react-bootstrap";
import Message from "../components/Message";

const OutstandingFeesScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const updateProfileDetails = useSelector(
    (state) => state.updateProfileDetails
  );
  const { success } = updateProfileDetails;

  // check for payment success and update member record
  // show succes message

  useEffect(() => {
    const addPayPalScript = async () => {
      console.log("adding script...");
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setSdkReady(true);
    }
    if (!memberInfo) {
      history.push("/login");
    }

    dispatch(getMemberDetails(memberInfo._id));
  }, [dispatch, memberInfo, history]);

  const successPaymentHandler = useCallback(
    async (paymentResult) => {
      if (paymentResult.status === "COMPLETED") {
        const values = {
          memberId: memberInfo._id,
          outstandingFees: 0,
        };
        console.log(values);
        await dispatch(updateProfile(values));
        setPaymentSuccess(true);
        console.log("payment successful");
      }
    },
    [dispatch, memberInfo._id]
  );

  return (
    <>
      <div className="mt-3">
        <Container fluid="lg">
          <h3 className="text-center border-bottom border-warning pb-1">
            Outstanding Payments
          </h3>
          <p>
            The amount below shows payments that are outstanding on your
            account. This has likely happened due to a payment not being able to
            be made from your direct debit for an addiitonal charge, perhaps for
            attending an extra class or a payment for a grading exam. You will
            have received an email from us explaining that we were unable to
            collect a payment.
          </p>

          <div className="max-width-600 mx-auto text-center">
            {!sdkReady ? (
              <Loader variant="warning" />
            ) : (
              <>
                <div className="bg-light text-center mb-2 p-3">
                  {member &&
                    member.outstandingFees !== 0 &&
                    paymentSuccess === false && (
                      <>
                        <h3 className="text-danger">
                          {[member.outstandingFees].toLocaleString("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          })}
                        </h3>
                        <PayPalButton
                          amount={member.outstandingFees}
                          onSuccess={successPaymentHandler}
                        />
                      </>
                    )}

                  {success && paymentSuccess === true && (
                    <>
                      <i className="fa-solid fa-circle-check text-success"></i>
                      <h5 className="text-success">Payment Success</h5>
                    </>
                  )}
                  {member && member.outstandingFees === 0 && (
                    <Message variant="success">No outstanding fees</Message>
                  )}
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default OutstandingFeesScreen;
