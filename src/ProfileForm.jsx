import { useContext, useMemo } from "react";
import "../node_modules/xterm/css/xterm.css";

import "./form.css";
import ImageSelect from "./ImageSelect";
import ResourceSelect from "./ResourceSelect";
import { RadioField } from "./components/form/fields";
import { SpawnerFormContext } from "./state";

/**
 * Generates the *contents* of the form shown in the profile selection page
 *
 * A <form> tag and a submit button are already included by JupyterHub, and should not
 * be generated here.
 */
function Form() {
  // Currently, we only support a single profile, with many options.
  const { profileList, profile, setProfile, errors } = useContext(SpawnerFormContext);

  const canSubmit = Object.keys(errors).length === 0;

  const profileOptions = useMemo(() => {
    return profileList.map(({slug, display_name, description}) => {
      return {
        value: slug,
        label: `${display_name} (${description})`
      }
    })
  }, [profileList]);

  return (
    <div className="form-grid">
      <RadioField
        id="profile"
        legend="Select profile"
        options={profileOptions}
        onChange={(e) => setProfile(e.target.value)}
      />
      {profile && (
        <>
          <ImageSelect config={profile.profile_options.image} />
          <ResourceSelect config={profile.profile_options.resources} />
          <div />
          <button
            className="btn btn-jupyter form-control"
            type="submit"
            disabled={!canSubmit}
          >
            Start
          </button>
        </>
      )}
    </div>
  );
}

export default Form;
