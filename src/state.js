import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const SpawnerFormContext = createContext();

function getDefaultOption(choices) {
  if (!choices) return;
  return (
    Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0]
  );
}

export const SpawnerFormProvider = ({ children }) => {
  const profileList = window.profileList;

  const [touched, setTouched] = useState({});
  const [image, setImage] = useState();
  const [customImage, setCustomImage] = useState("");
  const [resource, setResource] = useState();

  const [selectedProfile, setProfile] = useState();
  const profile = useMemo(() => {
    return profileList.find(({ slug }) => slug === selectedProfile);
  }, [selectedProfile]);

  const errors = useMemo(() => {
    if (!profile) {
      return { profile: "Select a profile" };
    }

    const e = {};
    if (!resource) {
      e[`profile-option-${profile.slug}--resouces`] =
        "Select the resouces allocation for your container.";
    }
    if (!image) {
      e[`profile-option-${profile.slug}--image`] = "Select an image";
    }
    if (!Object.keys(profile.profile_options.image.choices).includes(image)) {
      if (!customImage) {
        e[`profile-option-${profile.slug}--image--unlisted-choice`] =
          "Provide a custom image.";
      } else if (!/^.+:.+$/.test(customImage)) {
        e[`profile-option-${profile.slug}--image--unlisted-choice`] =
          "Must be a publicly available docker image, of form <image-name>:<tag>.";
      }
    }
    return e;
  }, [profile, image, resource, customImage]);

  useEffect(() => {
    if (!profile) return;
    const defaultImageKey = getDefaultOption(
      profile?.profile_options.image.choices,
    );
    setImage(defaultImageKey);

    const defaultResourceKey = getDefaultOption(
      profile?.profile_options.resources.choices,
    );
    setResource(defaultResourceKey);
  }, [profile]);

  const setFieldTouched = useCallback(
    (fieldName, isTouched) => {
      setTouched({
        ...touched,
        [fieldName]: isTouched,
      });
    },
    [touched],
  );

  const value = {
    profileList,
    profile,
    setProfile,
    image,
    setImage,
    customImage,
    setCustomImage,
    resource,
    setResource,
    touched,
    setTouched: setFieldTouched,
    errors,
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
