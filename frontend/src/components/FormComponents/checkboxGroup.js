import { Field, ErrorMessage } from "formik";
import React from "react";
import { FormCheck, FormGroup, FormLabel } from "react-bootstrap";
import TextError from "./TextError";

const checkboxGroup = ({ label, name, options, ...rest }) => {
  return (
    <FormGroup>
      <FormLabel>{label}</FormLabel>
      <Field name={name} {...rest} className="form-control">
        {({ field }) => {
          return options.map((option) => {
            return (
              <React.Fragment key={option.key}>
                <FormCheck
                  type="checkbox"
                  id={option.value}
                  {...field}
                  value={option.value}
                  checked={field.value.includes(option.value)}
                  label={option.key}
                />
              </React.Fragment>
            );
          });
        }}
      </Field>
      <ErrorMessage name={name} component={TextError} />
    </FormGroup>
  );
};

export default checkboxGroup;
