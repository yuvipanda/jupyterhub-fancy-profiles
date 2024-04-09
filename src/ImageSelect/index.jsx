import { useContext } from "react";
import { CustomizedSelect } from "../CustomSelect";
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
  const FIELD_ID = `profile-option-${profile}--image`;
  const FIELD_ID_UNLISTED = `${FIELD_ID}--unlisted-choice`;
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices, extraChoices);

  const { image, setImage, customImage, setCustomImage } =
    useContext(SpawnerFormContext);

  return (
    <>
      <div className="profile-option-label-container">
        <label htmlFor={FIELD_ID}>{display_name}</label>
      </div>
      <div className="profile-option-control-container">
        <CustomizedSelect
          options={options}
          id={FIELD_ID}
          defaultValue={defaultOption}
          onChange={(e) => setImage(e.value)}
        />
      </div>
      {image === "dockerImage" && (
        <>
          <div className="profile-option-label-container">
            <label htmlFor={FIELD_ID_UNLISTED}>Custom image</label>
          </div>
          <div className="profile-option-control-container">
            {/* Save and restore the typed in value, so we don't lose it if the user selects another choice */}
            <input
              type="text"
              id={FIELD_ID_UNLISTED}
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
            />
          </div>
        </>
      )}
      {image === "buildImage" && (
        <ImageBuilder name={FIELD_ID_UNLISTED} visible="true" />
      )}
    </>
  );
}

export default ImageSelect;
