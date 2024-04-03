import { CustomizedSelect } from "./CustomSelect";
import useSelectOptions from "./hooks/useSelectOptions";

function ResourceSelect({ config }) {
  const FIELD_ID = "resource";
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices);

  return (
    <>
      <div className="profile-option-label-container">
        <label htmlFor={FIELD_ID}>{display_name}</label>
      </div>
      <div className="profile-option-control-container">
        <CustomizedSelect
          options={options}
          id={FIELD_ID}
          name={FIELD_ID}
          defaultValue={defaultOption}
        />
      </div>
    </>
  )
}

export default ResourceSelect;
