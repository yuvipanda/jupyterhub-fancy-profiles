import { useState } from "react";
import Select from "react-select";

export function ProfileOption({
  profileSlug, optionName, displayName, choices, extraSelectableItems, hideFromForm,
}) {
  const formControlName = "profile-option-" + profileSlug + "-" + optionName;
  const defaultChoiceName = Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0];

  let options = Object.keys(choices).map((choiceName) => {
    return {
      value: choiceName,
      label: choices[choiceName].display_name,
      description: choices[choiceName].description,
    };
  });
  if (extraSelectableItems && extraSelectableItems.length > 0) {
    options = [...options, ...extraSelectableItems];
  }
  const defaultOption = options.find(
    (option) => option.value === defaultChoiceName
  );

  const [lastSelectedOption, setLastSelectedOption] = useState(null);

  return (
    <>
      <div className="profile-option-label-container">
        <label htmlFor={formControlName}>{displayName}</label>
      </div>
      <div className="profile-option-control-container">
        <Select
          options={options}
          name={hideFromForm || formControlName}
          defaultValue={defaultOption}
          formatOptionLabel={(option, meta) => {
            let classNames = ["react-select-item-container"];
            if (meta.selectValue[0].value === option.value) {
              // Check for the values, rather than the whole object, as react-select may make copies
              // We are rendering a value that is the current selection
              classNames.push("react-select-item-selected");
            }
            if (meta.context === "menu") {
              // We are rendering items for display in the menu of options
              classNames.push("react-select-item-menu-display");
            }
            return (
              <div className={classNames.join(" ")}>
                <div className="react-select-item-title">{option.label}</div>
                {option.description && (
                  <div className="react-select-item-description">
                    {option.description}
                  </div>
                )}
              </div>
            );
          }}
          onChange={(option) => {
            if (lastSelectedOption &&
              option !== lastSelectedOption &&
              lastSelectedOption.onDeselected) {
              lastSelectedOption.onDeselected();
            }
            if (option.onSelected) {
              option.onSelected();
            }
            setLastSelectedOption(option);
          }} />
      </div>
    </>
  );
}
