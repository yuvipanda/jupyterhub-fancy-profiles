import { createContext, useMemo, useState } from "react";

export const SpawnerFormContext = createContext();

export const SpawnerFormProvider = ({ children }) => {
  const profileList = window.profileList;
  const defaultProfile =
    profileList.find((profile) => profile.default === true) || profileList[0];
  const [selectedProfile, setProfile] = useState(defaultProfile.slug);

  const profile = useMemo(() => {
    return profileList.find(({ slug }) => slug === selectedProfile);
  }, [selectedProfile]);

  const value = {
    profileList,
    profile,
    setProfile,
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
