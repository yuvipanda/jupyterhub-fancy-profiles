import { useCallback, useState } from "react";
import { CustomizedSelect } from "../CustomSelect";
import { ImageBuilder } from "./ImageBuilder";
import useSelectOptions from "../hooks/useSelectOptions";

const extraChoices = [
  {
    value: "dockerImage",
    label: "Specify an existing docker image",
    description: "Use a pre-existing docker image from a public docker registry",
  }, {
    value: "buildImage",
    label: "Build your own image",
    description: "Use a mybinder.org compatible GitHub repo to build your own image",
  }
];


function ImageSelect({ config }) {
  const FIELD_ID = "image";
  const { display_name, choices } = config;

  const { options, defaultOption } = useSelectOptions(choices, extraChoices);

  const [value, setValue] = useState(defaultOption.value);
  const [imageName, setImageName] = useState('');
  const onChange = useCallback(e => setValue(e.value), []);

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
          onChange={onChange}
        />
      </div>
      {value === "dockerImage" && (
        <>
        <div className="profile-option-label-container">
          <label htmlFor="imageName">Custom image</label>
        </div>
        <div className="profile-option-control-container">
          {/* Save and restore the typed in value, so we don't lose it if the user selects another choice */}
          <input
            type="text"
            id="imageName"
            name="imageName"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />
        </div>
      </>
      )}
      {value === "buildImage" && (
        <ImageBuilder name="imageName" visible="true" />
      )}
    </>
  )
}

export default ImageSelect;
