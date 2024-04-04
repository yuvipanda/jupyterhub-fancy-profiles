import { useContext } from "react";
import { CustomizedSelect } from "./CustomSelect";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";

function ResourceSelect({ config }) {
  const FIELD_ID = "resource";
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices);
  const { setResource } = useContext(SpawnerFormContext);

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
          onChange={e => setResource(e.value)}
        />
      </div>
    </>
  )
}

export default ResourceSelect;
