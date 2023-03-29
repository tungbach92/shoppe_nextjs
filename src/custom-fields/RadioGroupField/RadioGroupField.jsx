import React from "react";
import PropTypes from "prop-types";
// import { ErrorMessage } from "formik";
const RadioGroupField = (props) => {
  const {
    field,
    form,

    id,
    type,
    label,
    disabled,
    labelClassName,
    inputClassName,
  } = props;

  const { name } = field; // checked set by Formik
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];
  return (
    <>
      <input
        {...field}
        id={id}
        type={type}
        className={
          showError
            ? inputClassName + ` ${inputClassName}--invalid`
            : inputClassName
        }
        disabled={disabled}
      />
      {label && (
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
      )}
      {/* {showError && (
        <div className={`${inputClassName}--invalid`}>{errors[name]}</div>
      )} */}
      {/* <ErrorMessage name={name} /> */}
    </>
  );
};

RadioGroupField.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
};

RadioGroupField.defaultProps = {
  type: "text",
  label: "",
  disabled: false,
  labelClassName: "",
  inputClassName: "",
};

export default RadioGroupField;
