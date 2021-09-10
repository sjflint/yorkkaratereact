import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { FormGroup, FormLabel } from "react-bootstrap";

const Input = ({ label, name, placeholder, margin, ...rest }) => {
  return (
    <FormGroup className={margin}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Field
        id={name}
        name={name}
        {...rest}
        placeholder={placeholder}
        className="form-control"
      />
      <ErrorMessage name={name} component={TextError} />
    </FormGroup>
  );
};

export default Input;
