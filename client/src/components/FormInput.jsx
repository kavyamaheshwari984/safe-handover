import React from 'react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required,
  error
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        className="form-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormInput;
