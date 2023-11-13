import { useState } from "react";
import { CustomizedSelect } from "./CustomSelect";

export function ProfileOption({
  profileSlug,
  optionName,
  displayName,
  choices,
  unlistedChoice,
  extraSelectableItem,
}) {
  const [unlistedChoiceVisible, setUnlistedChoiceVisible] = useState(false);
  const [unlistedChoiceValue, setUnlistedChoiceValue] = useState("");
  const [extraSelectableItemVisible, setExtraSelectableItemVisible] =
    useState(false);

  const listedInputName = `profile-option-${profileSlug}--${optionName}`;
  const unlistedInputName = `${listedInputName}--unlisted-choice`;

  const defaultChoiceName =
    Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0];

  let options = Object.keys(choices).map((choiceName) => {
    return {
      value: choiceName,
      label: choices[choiceName].display_name,
      description: choices[choiceName].description,
    };
  });

  if (unlistedChoice && unlistedChoice.enabled) {
    options.push({
      value: "--unlisted-choice",
      label: unlistedChoice.display_name_in_choices,
      description: unlistedChoice.description_in_choices,
      onSelected: () => {
        setUnlistedChoiceVisible(true);
      },
      onDeselected: () => {
        setUnlistedChoiceVisible(false);
      },
    });
  }
  const defaultOption = options.find(
    (option) => option.value === defaultChoiceName,
  );

  if (extraSelectableItem) {
    options.push({
      value: "--extra-selectable-item",
      label: extraSelectableItem.display_name_in_choices,
      description: extraSelectableItem.description_in_choices,
      onSelected: () => {
        setExtraSelectableItemVisible(true);
      },
      onDeselected: () => {
        setExtraSelectableItemVisible(false);
      },
    });
  }

  return (
    <>
      <div className="profile-option-label-container">
        <label htmlFor={listedInputName}>{displayName}</label>
      </div>
      <div className="profile-option-control-container">
        <CustomizedSelect
          options={options}
          name={
            extraSelectableItemVisible || unlistedChoiceVisible
              ? null
              : listedInputName
          }
          defaultValue={defaultOption}
        />
      </div>

      {unlistedChoiceVisible && (
        <>
          <div className="profile-option-label-container">
            <label>{unlistedChoice.display_name}</label>
          </div>
          <div className="profile-option-control-container">
            {/* Save and restore the typed in value, so we don't lose it if the user selects another choice */}
            <input
              type="text"
              name={unlistedInputName}
              defaultValue={unlistedChoiceValue}
              onChange={(ev) => {
                setUnlistedChoiceValue(ev.target.value);
              }}
            />
          </div>
        </>
      )}

      {extraSelectableItem && (
        <extraSelectableItem.component
          visible={extraSelectableItemVisible}
          unlistedInputName={unlistedInputName}
        />
      )}
    </>
  );
}
