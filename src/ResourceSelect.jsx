import { useContext } from "react";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";
import { SelectField } from "./components/form/fields";

function ResourceSelect({ config }) {
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices);
  const { setResource, profile, touched, setTouched, errors } =
    useContext(SpawnerFormContext);
  const FIELD_ID = `profile-option-${profile.slug}--resource`;

  return (
    <SelectField
      id={FIELD_ID}
      label={display_name}
      options={options}
      defaultOption={defaultOption}
      error={touched[FIELD_ID] && errors[FIELD_ID]}
      onChange={(e) => setResource(e.value)}
      onBlur={() => setTouched(FIELD_ID, true)}
    />
  );
}

export default ResourceSelect;
