import "../node_modules/xterm/css/xterm.css";

import "./form.css";
import ImageSelect from "./ImageSelect";
import ResourceSelect from "./ResourceSelect";
import { SpawnerFormContext } from "./state";
import { useContext } from "react";

/**
 * Generates the *contents* of the form shown in the profile selection page
 *
 * A <form> tag and a submit button are already included by JupyterHub, and should not
 * be generated here.
 */
function Form() {
  // Currently, we only support a single profile, with many options.
  const { profile } = useContext(SpawnerFormContext);
  const { image, resources } = profile.profile_options;

  return (
    <div className="form-grid">
      <input
        type="radio"
        className="hidden"
        name="profile"
        value={profile.slug}
        checked
        readOnly
      />
      <ImageSelect config={image} />
      <ResourceSelect config={resources} />
      <div />
      <button className="btn btn-jupyter form-control" type="submit">
        Start
      </button>
    </div>
  );
}

export default Form;
