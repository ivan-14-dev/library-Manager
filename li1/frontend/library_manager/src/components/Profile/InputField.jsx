import React from "react";

const InputField = ({ label, type = "text", icon, disabled, register, error }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}
      {type === "textarea" ? (
        <textarea {...register} disabled={disabled}></textarea>
      ) : (
        <input type={type} {...register} disabled={disabled} />
      )}
    </div>
    {error && <p className="error">{error.message}</p>}
  </div>
);

export { InputField };
