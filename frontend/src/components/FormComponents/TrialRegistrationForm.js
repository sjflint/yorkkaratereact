import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import "yup-phone";
import { listTrainingSessions } from "../../actions/trainingSessionActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { registerTrial } from "../../actions/trialRegistrationActions";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { listFinancials } from "../../actions/financialActions";

const TrialRegistrationForm = () => {
  const [experience, setExperience] = useState("beginner");
  const [age, setAge] = useState("junior");
  const dispatch = useDispatch();
  const history = useHistory();

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const { error, trainingSessions } = trainingSessionsList;

  const trialRegister = useSelector((state) => state.trialRegister);
  const {
    loading: loadingFormSubmit,
    error: errorFormSubmit,
    applicant,
  } = trialRegister;

  useEffect(() => {
    dispatch(listFinancials());
    dispatch(listTrainingSessions());

    if (applicant) {
      history.push(`/trialregistration/pay/${applicant.trialClassId}`);
    }
  }, [dispatch, applicant, history]);

  let classOptions = [];

  if (experience === "beginner" && trainingSessions && age === "junior") {
    classOptions = [];

    trainingSessions.forEach((trainingSession) => {
      if (
        trainingSession.juniorSession === true &&
        trainingSession.capacity > trainingSession.numberBooked
      ) {
        const name = `${trainingSession.name} (${trainingSession.location})`;
        const id = trainingSession._id;
        classOptions.push({ key: name, value: id });
      }
    });
  } else if (
    experience === "beginner" &&
    trainingSessions &&
    age === "novice"
  ) {
    classOptions = [];

    trainingSessions.forEach((trainingSession) => {
      if (
        trainingSession.juniorSession === false &&
        trainingSession.maxGradeLevel > 6 &&
        trainingSession.capacity > trainingSession.numberBooked
      ) {
        const name = `${trainingSession.name} (${trainingSession.location})`;
        const id = trainingSession._id;
        classOptions.push({ key: name, value: id });
      }
    });
  } else if (experience === "intermediate" && trainingSessions) {
    classOptions = [];

    trainingSessions.forEach((trainingSession) => {
      if (
        trainingSession.minGradeLevel < 7 &&
        trainingSession.capacity > trainingSession.numberBooked
      ) {
        const name = `${trainingSession.name} (${trainingSession.location})`;
        const id = trainingSession._id;
        classOptions.push({ key: name, value: id });
      }
    });
  } else {
    classOptions = [];
  }

  const medicalOptions = [
    { key: "No", value: "No medical issues" },
    { key: "Yes", value: "Yes medical" },
  ];

  const dropdownAgeOptions = [
    { key: "Under 9 years old", value: "junior" },
    { key: "9 years old or above", value: "novice" },
  ];
  const dropdownExperienceOptions = [
    {
      key: "beginner - less than two years experience of Shotokan Karate",
      value: "beginner",
    },
    {
      key: "Intermediate/Advanced - more than two years experience",
      value: "intermediate",
    },
  ];

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ageGroup: age,
    experienceLevel: experience,
    medicalStatus: "",
    medicalDetails: "",
    classSelection: "",
  };
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("required"),
    email: Yup.string().required("Required").email(),
    phone: Yup.string().required("Required").phone("GB", true),
    experienceLevel: Yup.string().required("Required"),
    ageGroup: Yup.string().required("Required"),
    medicalStatus: "",
    classSelection: Yup.string().required("Required"),
  });

  const onSubmit = (values) => {
    dispatch(registerTrial(values));
  };

  return errorFormSubmit ? (
    <Message variant="danger">{errorFormSubmit}</Message>
  ) : loadingFormSubmit ? (
    <Loader variant="warning" />
  ) : (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => (
          <Form
            className="py-2 d-flex flex-column"
            id="trialregistrationform"
            name="trialregistrationform"
            action="sendTrialRegistration"
            method="POST"
          >
            <div className="bg-light mb-2 p-2">
              <FormikControl
                control="input"
                type="text"
                label="First Name (of participant)"
                name="firstName"
                placeholder="Please enter your first name"
              />
            </div>
            <div className="bg-light mb-2 p-2">
              <FormikControl
                control="input"
                type="text"
                label="Last Name (of participant)"
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
            <div className="bg-light mb-2 p-2">
              <FormikControl
                control="select"
                label="Age Group"
                name="ageGroup"
                options={dropdownAgeOptions}
              />
              {setAge(values.ageGroup)}
            </div>
            <div className="bg-light mb-2 p-2">
              <FormikControl
                control="select"
                label="Experience Level"
                name="experienceLevel"
                options={dropdownExperienceOptions}
              />
              {setExperience(values.experienceLevel)}
              <small>
                'Shotokan' is the specific style of karate that we practice. If
                you have experience in another style of karate, or a different
                martial art, we would recommend attending our beginner classes
                first.
              </small>
            </div>

            <div className="bg-light mb-2 p-2">
              <FormikControl
                control="radio"
                label="Do you suffer from any medical conditions or disabilities that could affect you when practicing karate?"
                name="medicalStatus"
                options={medicalOptions}
              />
              {values.medicalStatus === "Yes medical" ? (
                <FormikControl
                  control="input"
                  as="textarea"
                  label="Please provide further details"
                  name="medicalDetails"
                  placeholder="A brief description"
                />
              ) : null}
            </div>
            <div className="bg-light mb-2 p-2">
              {error ? (
                <Message variant="warning">{error}</Message>
              ) : (
                <FormikControl
                  control="radio"
                  label="Please select the class you wish to attend"
                  name="classSelection"
                  options={classOptions}
                />
              )}
            </div>

            <button type="submit" className="mt-1 btn-block btn-default btn">
              Submit
            </button>
          </Form>
        )}
      </Formik>
      ;
    </>
  );
};

export default TrialRegistrationForm;
