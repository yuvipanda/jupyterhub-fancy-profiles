import { CustomizedSelect } from "./CustomSelect";

function Field({ id, label, children, error }) {
  return (
    <div className={`profile-option-container ${error ? "has-error" : ""}`}>
      <div className="profile-option-label-container">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="profile-option-control-container">
        {children}

        {error && <div className="profile-option-control-error">{error}</div>}
      </div>
    </div>
  );
}

export function SelectField({
  id,
  label,
  options,
  defaultOption,
  error,
  onChange,
  onBlur,
}) {
  return (
    <Field id={id} label={label} error={error}>
      <CustomizedSelect
        options={options}
        id={id}
        name={id}
        defaultValue={defaultOption}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Field>
  );
}

export function TextField({
  id,
  label,
  value,
  required,
  error,
  onChange,
  onBlur,
}) {
  return (
    <Field id={id} label={label} error={error}>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      />
    </Field>
  );
}
