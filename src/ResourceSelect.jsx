import { useContext } from "react";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";
import { SelectField } from "./components/form/fields";

function ResourceSelect({ config, isActive }) {
  const { display_name, choices, slug } = config;

  const { options, defaultOption } = useSelectOptions(choices);
  const { setResource, touched, setTouched, errors } =
    useContext(SpawnerFormContext);
  const FIELD_ID = `profile-option-${slug}--resource`;

  return (
    <SelectField
      id={FIELD_ID}
      label={display_name}
      options={options}
      defaultOption={defaultOption}
      error={touched[FIELD_ID] && errors[FIELD_ID]}
      onChange={(e) => setResource(e.value)}
      onBlur={() => setTouched(FIELD_ID, true)}
      tabIndex={isActive ? "0" : "-1"}
    />
  );
}

export default ResourceSelect;
