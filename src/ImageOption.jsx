import { ImageBuilder } from "./ImageBuilder";
import { ProfileOption } from "./ProfileOption";
import { ImageSpecifier } from "./ImageSpecifier";
import { useContext } from "react";
import { IMAGE_OPTION_VIEWS, SpawnerFormContext } from "./state";

export function ImageOption({ profileSlug, optionName, displayName, choices }) {
  const unlistedImageFormInputName = `profile-option-${profileSlug}--${optionName}--unlisted-choice`;
  const { unlistedImage, imageOptionView, setImageOptionView } =
    useContext(SpawnerFormContext);

  const extraSelectableItems = [
    {
      value: "--other--specify",
      label: "Specify an existing docker image",
      description:
        "Use a pre-existing docker image from a public docker registry (dockerhub, quay, etc)",
      onSelected: () => {
        setImageOptionView(IMAGE_OPTION_VIEWS.specifier);
      },
    },
    {
      value: "--other--build",
      label: "Build your own image",
      description:
        "Use a mybinder.org compatible GitHub repository to build your own image",
      onSelected: () => {
        setImageOptionView(IMAGE_OPTION_VIEWS.builder);
      },
    },
  ];

  return (
    <>
      {/* When we send an explicit image with unlisted choice, we should *not* send a value for the image field itself
          This will confuse KubeSpawner and give us a 5xx. So we render the name attribute *only* if we are sending an
          image option from the listed choices, and let it be empty if not.
          */}
      <ProfileOption
        hideFromForm={imageOptionView !== IMAGE_OPTION_VIEWS.choices}
        profileSlug={profileSlug}
        optionName={optionName}
        displayName={displayName}
        choices={choices}
        extraSelectableItems={extraSelectableItems}
        onChange={(option) => {
          let extraValueSelected = false;
          for (const extraItem of extraSelectableItems) {
            if (extraItem.value === option.value && extraItem.onSelected) {
              extraItem.onSelected();
              extraValueSelected = true;
              break;
            }
          }
          if (!extraValueSelected) {
            // User clicked an existing choice, not the two extra items we sent
            setImageOptionView(IMAGE_OPTION_VIEWS.choices);
          }
        }}
      />

      <ImageSpecifier
        visible={imageOptionView === IMAGE_OPTION_VIEWS.specifier}
      />
      <ImageBuilder visible={imageOptionView === IMAGE_OPTION_VIEWS.builder} />

      {imageOptionView !== IMAGE_OPTION_VIEWS.choices &&
        unlistedImage !== "" && (
          <input
            type="hidden"
            name={unlistedImageFormInputName}
            value={unlistedImage}
          />
        )}
    </>
  );
}
