import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { FormGroup, FormLabel } from "react-bootstrap";

const Textarea = ({ label, name, placeholder, ...rest }) => {
  return (
    <FormGroup>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Field
        id={name}
        name={name}
        {...rest}
        placeholder={placeholder}
        className="form-control"
        as="textarea"
      />
      <ErrorMessage name={name} component={TextError} />
    </FormGroup>
  );
};

export default Textarea;
