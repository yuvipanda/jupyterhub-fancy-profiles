import { useContext } from "react";
import { CustomizedSelect } from "./CustomSelect";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";

function ResourceSelect({ config }) {
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices);
  const { setResource, profile, touched, setTouched, errors } = useContext(SpawnerFormContext);
  const FIELD_ID = `profile-option-${profile.slug}--resource`;
  const hasError = errors[FIELD_ID] && touched[FIELD_ID];

  return (
    <div className={`profile-option-container ${hasError ? "has-error" : ""}`}>
      <div className="profile-option-label-container">
        <label htmlFor={FIELD_ID}>{display_name}</label>
      </div>
      <div className="profile-option-control-container">
        <CustomizedSelect
          options={options}
          id={FIELD_ID}
          name={FIELD_ID}
          defaultValue={defaultOption}
          onChange={(e) => setResource(e.value)}
          onBlur={() => setTouched(FIELD_ID, true)}
          hasError={hasError}
        />
        {hasError && (
          <div className="profile-option-control-error">{errors[FIELD_ID]}</div>
        )}
      </div>
    </div>
  );
}

export default ResourceSelect;
