import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { FormGroup, FormLabel, InputGroup } from "react-bootstrap";

const Currency = ({ label, name, placeholder, margin, ...rest }) => {
  return (
    <FormGroup className={margin}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <InputGroup>
        <InputGroup.Text>£</InputGroup.Text>

        <Field
          id={name}
          name={name}
          {...rest}
          placeholder={placeholder}
          className="form-control"
        />
      </InputGroup>

      <ErrorMessage name={name} component={TextError} />
    </FormGroup>
  );
};

export default Currency;
