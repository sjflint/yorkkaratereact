import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import "yup-phone";
import { useDispatch } from "react-redux";
import { addToWaitingList } from "../../actions/trainingSessionActions";

const WaitingListForm = ({ classId }) => {
  const dispatch = useDispatch();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required").trim(),
    lastName: Yup.string().required("Required").trim(),
    email: Yup.string().required("Required").email().trim(),
    phone: Yup.string().required("Required").phone("GB", true).trim(),
  });
  const onSubmit = (values, onSubmitProps) => {
    values.classId = classId;
    dispatch(addToWaitingList(values));
    onSubmitProps.resetForm();
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form
          className="py-2 d-flex flex-column"
          id="waitinglistform"
          name="waitinglistform"
          action="sendWaitingList"
          method="POST"
        >
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="text"
              label="firstName"
              name="firstName"
              placeholder="Please enter your first name"
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="text"
              label="lastName"
              name="lastName"
              placeholder="Please enter your last name"
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="email"
              label="Email"
              name="email"
              placeholder="email"
            />
          </div>
          <div className="bg-light mb-2 p-2">
            <FormikControl
              control="input"
              type="text"
              label="Phone"
              name="phone"
              placeholder="Please enter your phone number"
            />
          </div>

          <Button type="submit" className="mt-1 btn-link" variant="secondary">
            Submit
          </Button>
        </Form>
      </Formik>
    </>
  );
};

export default WaitingListForm;
