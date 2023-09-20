import { createRoot } from "react-dom/client";
import { ImageBuilder } from "./ImageBuilder";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";

import "../node_modules/xterm/css/xterm.css";

import "./form.css";

function ProfileOption({
  profileSlug,
  optionName,
  displayName,
  choices,
  extraSelectableItems,
  hideFromForm,
}) {
  const formControlName = "profile-option-" + profileSlug + "-" + optionName;
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
            if (
              lastSelectedOption &&
              option !== lastSelectedOption &&
              lastSelectedOption.onDeselected
            ) {
              lastSelectedOption.onDeselected();
            }
            if (option.onSelected) {
              option.onSelected();
            }
            setLastSelectedOption(option);
          }}
        />
      </div>
    </>
  );
}

function ImageSpecifier({ visible, setUnlistedImage }) {
  const [specifiedImage, setSpecifiedImage] = useState("");
  useEffect(() => {
    console.log("visibility triggered");
    console.log(visible);
    if (!visible) {
      setUnlistedImage("");
    }
  }, [visible]);
  return (
    visible && (
      <>
        <div className="profile-option-label-container">
          <label>Custom Image</label>
        </div>
        <div className="profile-option-control-container">
          {/* Save and restore the typed in value, so we don't lose it if the user selects another choice */}
          <input
            type="text"
            defaultValue={specifiedImage}
            onChange={(ev) => {
              const val = ev.target.value;
              setSpecifiedImage(val);
              setUnlistedImage(val);
            }}
          />
        </div>
      </>
    )
  );
}

function ImageOption({
  profileSlug,
  optionName,
  displayName,
  choices,
  setCanStart,
}) {
  const [showImageBuilder, setShowImageBuilder] = useState(false);
  const [showImageSpecifier, setShowImageSpecifier] = useState(false);
  const [unlistedImage, setUnlistedImage] = useState("");
  const unlistedImageFormInputName = `profile-option-${profileSlug}--${optionName}--unlisted-choice`;

  const extraSelectableItems = [
    {
      value: "--other--specify",
      label: "Specify an existing docker image",
      description:
        "Use a pre-existing docker image from a public docker registry (dockerhub, quay, etc)",
      onSelected: () => {
        setShowImageSpecifier(true);
      },
      onDeselected: () => {
        setShowImageSpecifier(false);
      },
    },
    {
      value: "--other--build",
      label: "Build your own image",
      description:
        "Use a mybinder.org compatible GitHub repository to build your own image",
      onSelected: () => {
        setShowImageBuilder(true);
      },
      onDeselected: () => {
        setShowImageBuilder(false);
      },
    },
  ];

  useEffect(() => {
    // This is run each time showImageSpecifier is changed
    if (showImageSpecifier || showImageBuilder) {
      // Image specifier is shown. If the user had *already* typed an image name
      // here, and then navigated away to a different option, and then navigated
      // back to the image specifier, specifiedImage will already be not empty.
      // In this case, the user *can* start a server, as image is already specified.
      setCanStart(unlistedImage.trim() !== "");
    } else {
      // The image specifier is hidden now, so from the perspective of the
      // image specifier, starting can happen.
      setCanStart(true);
    }
  }, [showImageSpecifier, unlistedImage, showImageBuilder]);

  return (
    <>
      {/* When we send an explicit image with unlisted choice, we should *not* send a value for the image field itself
          This will confuse KubeSpawner and give us a 5xx. So we render the name attribute *only* if we are sending an
          image option from the listed choices, and let it be empty if not.
      */}
      <ProfileOption
        hideFromForm={showImageBuilder || showImageSpecifier}
        profileSlug={profileSlug}
        optionName={optionName}
        displayName={displayName}
        choices={choices}
        extraSelectableItems={extraSelectableItems}
      />

      <ImageSpecifier
        visible={showImageSpecifier}
        unlistedImageFormInputName={unlistedImageFormInputName}
        setUnlistedImage={setUnlistedImage}
      />
      <ImageBuilder
        visible={showImageBuilder}
        inputName={unlistedImageFormInputName}
        setUnlistedImage={setUnlistedImage}
      />

      {(showImageBuilder || showImageSpecifier) && unlistedImage !== "" && (
        <input
          type="hidden"
          name={unlistedImageFormInputName}
          value={unlistedImage}
        />
      )}
    </>
  );
}
function ResourceSelector({ profile, setCanStart }) {
  const options = profile.profile_options;
  return (
    <div className="resource-selector">
      {Object.keys(options).map((optionName) => {
        const OptionComponent =
          optionName === "image" ? ImageOption : ProfileOption;
        const optionBody = options[optionName];
        return (
          <OptionComponent
            setCanStart={setCanStart}
            key={optionName}
            optionName={optionName}
            displayName={optionBody.display_name}
            profileSlug={profile.slug}
            choices={optionBody.choices}
          />
        );
      })}
    </div>
  );
}

/**
 * Generates the *contents* of the form shown in the profile selection page
 *
 * A <form> tag and a submit button are already included by JupyterHub, and should not
 * be generated here.
 */
function Form() {
  const profileList = window.profileList;
  const profile = profileList[0];
  const startButton = useRef(
    document.querySelector(".feedback-container input[type='submit']")
  );

  const [canStart, setCanStart] = useState(true);

  useEffect(() => {
    startButton.current.disabled = !canStart;
  }, [canStart]);

  return (
    <>
      {/* We only support a single profile, and it must be marked as selected */}
      <input
        type="radio"
        className="hidden"
        name="profile"
        value={profile.slug}
        checked
        readOnly
      />

      <ResourceSelector profile={profile} setCanStart={setCanStart} />
    </>
  );
}

const root = createRoot(document.getElementById("form"));
root.render(<Form />);
