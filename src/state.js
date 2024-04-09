import { createContext, useCallback, useMemo, useState } from "react";

export const SpawnerFormContext = createContext();

function getDefaultOption(choices) {
  return (
    Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0]
  );
}

export const SpawnerFormProvider = ({ children }) => {
  const profileList = window.profileList;
  const profile = profileList[0];

  const defaultImageKey = getDefaultOption(
    profile.profile_options.image.choices,
  );
  const defaultResourceKey = getDefaultOption(
    profile.profile_options.resources.choices,
  );

  const [image, setImage] = useState(defaultImageKey);
  const [customImage, setCustomImage] = useState("");
  const [resource, setResource] = useState(defaultResourceKey);

  const [touched, setTouched] = useState({});
  const setFieldTouched = useCallback((fieldName, isTouched) => {
    setTouched({
      ...touched,
      [fieldName]: isTouched
    })
  }, [touched]);

  const errors = useMemo(() => {
    const e = {};
    if (!resource) {
      e[`profile-option-${profile.slug}--resouces`] = "Select the resouces allocation for your container."
    }
    if (!image) {
      e[`profile-option-${profile.slug}--image`] = "Select an image"
    }
    if (!Object.keys(profile.profile_options.image.choices).includes(image) && !customImage) {
      e[`profile-option-${profile.slug}--image--unlisted-choice`] = "Provide a custom image."
    }
    return e;
  }, [image, resource, customImage]);

  const value = {
    profile,
    image,
    setImage,
    customImage,
    setCustomImage,
    resource,
    setResource,
    touched,
    setTouched: setFieldTouched,
    errors
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
