import { ImageBuilder } from "./ImageBuilder";
import { useEffect, useState } from "react";
import { ProfileOption } from "./ProfileOption";
import { ImageSpecifier } from "./ImageSpecifier";

export function ImageOption({
  profileSlug, optionName, displayName, choices, setCanStart,
}) {
  const [showImageBuilder, setShowImageBuilder] = useState(false);
  const [showImageSpecifier, setShowImageSpecifier] = useState(false);
  const [unlistedImage, setUnlistedImage] = useState("");
  const unlistedImageFormInputName = `profile-option-${profileSlug}--${optionName}--unlisted-choice`;

  const extraSelectableItems = [
    {
      value: "--other--specify",
      label: "Specify an existing docker image",
      description: "Use a pre-existing docker image from a public docker registry (dockerhub, quay, etc)",
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
      description: "Use a mybinder.org compatible GitHub repository to build your own image",
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
        extraSelectableItems={extraSelectableItems} />

      <ImageSpecifier
        visible={showImageSpecifier}
        unlistedImageFormInputName={unlistedImageFormInputName}
        setUnlistedImage={setUnlistedImage} />
      <ImageBuilder
        visible={showImageBuilder}
        inputName={unlistedImageFormInputName}
        setUnlistedImage={setUnlistedImage} />

      {(showImageBuilder || showImageSpecifier) && unlistedImage !== "" && (
        <input
          type="hidden"
          name={unlistedImageFormInputName}
          value={unlistedImage} />
      )}
    </>
  );
}
