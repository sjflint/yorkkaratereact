import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { FormGroup, FormLabel } from "react-bootstrap";

const Select = ({ label, name, options, placeholder, ...rest }) => {
  return (
    <FormGroup>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Field
        id={name}
        name={name}
        {...rest}
        placeholder={placeholder}
        className="form-control"
        as="select"
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          );
        })}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </FormGroup>
  );
};

export default Select;
