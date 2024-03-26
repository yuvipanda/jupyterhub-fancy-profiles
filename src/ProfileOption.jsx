import { useEffect, useState } from "react";
import { CustomizedSelect } from "./CustomSelect";
import { SpawnerFormContext, CHOICE_TYPE } from "./state";
import { useContext } from "react";

export function ProfileOption({
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

  const { setOptionValue } = useContext(SpawnerFormContext);

  const defaultChoiceName =
    Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0];

  useEffect(() => {
    // Mark the default option as 'selected'
    setOptionValue(optionName, CHOICE_TYPE.LISTED, defaultChoiceName);
  }, []);

  let options = Object.keys(choices).map((choiceName) => {
    return {
      value: choiceName,
      label: choices[choiceName].display_name,
      description: choices[choiceName].description,
      onSelected: () => {
        setOptionValue(optionName, CHOICE_TYPE.LISTED, choiceName);
      },
    };
  });

  if (unlistedChoice && unlistedChoice.enabled) {
    options.push({
      value: "--unlisted-choice",
      label: unlistedChoice.display_name_in_choices,
      description: unlistedChoice.description_in_choices,
      onSelected: () => {
        setOptionValue(optionName, CHOICE_TYPE.UNLISTED, unlistedChoiceValue);
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
        <label>{displayName}</label>
      </div>
      <div className="profile-option-control-container">
        <CustomizedSelect
          options={options}
          name={null}
          defaultValue={defaultOption}
          on
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
              defaultValue={unlistedChoiceValue}
              onChange={(ev) => {
                setUnlistedChoiceValue(ev.target.value);
                setOptionValue(
                  optionName,
                  CHOICE_TYPE.UNLISTED,
                  ev.target.value,
                );
              }}
            />
          </div>
        </>
      )}

      {extraSelectableItem && (
        <extraSelectableItem.component
          optionName={optionName}
          visible={extraSelectableItemVisible}
        />
      )}
    </>
  );
}
