import { useContext, useState } from "react";
import useSelectOptions from "./hooks/useSelectOptions";
import { SpawnerFormContext } from "./state";
import { SelectField, TextField} from "./components/form/fields";

function ResourceSelect({ id, profile, config, isActive }) {
  const { display_name } = config;

  const { options, defaultOption } = useSelectOptions(config);
  const { touched, setTouched, errors } =
    useContext(SpawnerFormContext);
  const FIELD_ID = `profile-option-${profile}--${id}`;
  const FIELD_ID_UNLISTED = `${FIELD_ID}--unlisted-choice`;

  const [value, setValue] = useState(defaultOption.value);
  const [unlistedChoiceValue, setUnlistedChoiceValue] = useState();

  return (
    <>
      <SelectField
        id={FIELD_ID}
        label={display_name}
        options={options}
        defaultOption={defaultOption}
        error={touched[FIELD_ID] && errors[FIELD_ID]}
        onChange={(e) => setValue(e.value)}
        onBlur={() => setTouched(FIELD_ID, true)}
        tabIndex={isActive ? "0" : "-1"}
      />
      {value === "unlisted_choice" && (
        <TextField
          id={FIELD_ID_UNLISTED}
          label="Custom image"
          value={unlistedChoiceValue}
          required
          pattern="^.+:.+$"
          error={touched[FIELD_ID_UNLISTED] && errors[FIELD_ID_UNLISTED]}
          onChange={(e) => setUnlistedChoiceValue(e.target.value)}
          onBlur={() => setTouched(FIELD_ID_UNLISTED, true)}
          tabIndex={isActive ? "0" : "-1"}
        />
      )}
    </>
  );
}

export default ResourceSelect;
