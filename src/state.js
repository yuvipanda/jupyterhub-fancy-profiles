import { createContext, useMemo, useState } from "react";

export const SpawnerFormContext = createContext();

export const SpawnerFormProvider = ({ children }) => {
  const profileList = window.profileList;
  const [selectedProfile, setProfile] = useState();

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
