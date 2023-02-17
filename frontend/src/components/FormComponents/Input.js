import { Field, ErrorMessage } from "formik";
import TextError from "./TextError";
import { FormGroup, FormLabel } from "react-bootstrap";
import { useRef } from "react";

const Input = ({ label, name, placeholder, margin, ...rest }) => {
  const myRef = useRef(null);
  return (
    <FormGroup className={margin}>
      <FormLabel htmlFor={name}>{label}</FormLabel>

      <Field
        id={name}
        name={name}
        {...rest}
        placeholder={placeholder}
        className="form-control"
        autoComplete="address-line2"
      />

      <ErrorMessage
        name={name}
        component={TextError}
        onChange={() => myRef.current.scrollIntoView()}
      />
    </FormGroup>
  );
};

export default Input;
