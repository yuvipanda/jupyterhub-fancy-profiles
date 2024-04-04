import { createContext, useState } from "react";

export const SpawnerFormContext = createContext();

function getDefaultOption(choices) {
  return Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0];
}

export const SpawnerFormProvider = ({ children }) => {
  const profileList = window.profileList;
  const profile = profileList[0];

  const defaultImageKey = getDefaultOption(profile.profile_options.image.choices);
  const defaultResourceKey = getDefaultOption(profile.profile_options.resources.choices);

  const [image, setImage] = useState(defaultImageKey);
  const [customImage, setCustomImage] = useState('');
  const [resource, setResource] = useState(defaultResourceKey);

  const value = {
    profile,
    image,
    setImage,
    customImage,
    setCustomImage,
    resource,
    setResource
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
