import { useContext } from "react";
import { SelectField, TextField } from "../components/form/fields";
import { ImageBuilder } from "./ImageBuilder";
import useSelectOptions from "../hooks/useSelectOptions";
import { SpawnerFormContext } from "../state";

const extraChoices = [
  {
    value: "dockerImage",
    label: "Specify an existing docker image",
    description:
      "Use a pre-existing docker image from a public docker registry",
  },
  {
    value: "buildImage",
    label: "Build your own image",
    description:
      "Use a mybinder.org compatible GitHub repo to build your own image",
  },
];

function ImageSelect({ config }) {
  const { profile } = useContext(SpawnerFormContext);
  const FIELD_ID = `profile-option-${profile.slug}--image`;
  const FIELD_ID_UNLISTED = `${FIELD_ID}--unlisted-choice`;
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices, extraChoices);

  const {
    image,
    setImage,
    customImage,
    setCustomImage,
    errors,
    touched,
    setTouched,
  } = useContext(SpawnerFormContext);

  return (
    <>
      <SelectField
        id={FIELD_ID}
        label={display_name}
        options={options}
        defaultOption={defaultOption}
        error={touched[FIELD_ID] && errors[FIELD_ID]}
        onChange={(e) => setImage(e.value)}
        onBlur={() => setTouched(FIELD_ID, true)}
      />
      {image === "dockerImage" && (
        <TextField
          id={FIELD_ID_UNLISTED}
          label="Custom image"
          value={customImage}
          required
          pattern="^.+:.+$"
          error={touched[FIELD_ID_UNLISTED] && errors[FIELD_ID_UNLISTED]}
          onChange={(e) => setCustomImage(e.target.value)}
          onBlur={() => setTouched(FIELD_ID_UNLISTED, true)}
        />
      )}
      {image === "buildImage" && (
        <ImageBuilder name={FIELD_ID_UNLISTED} visible="true" />
      )}
    </>
  );
}

export default ImageSelect;
