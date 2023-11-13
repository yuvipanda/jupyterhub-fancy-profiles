import { createRoot } from "react-dom/client";

import "../node_modules/xterm/css/xterm.css";

import "./form.css";
import { ResourceSelector } from "./ResourceSelector";
import { SpawnerFormContext, SpawnerFormProvider } from "./state";
import { useContext } from "react";

/**
 * Generates the *contents* of the form shown in the profile selection page
 *
 * A <form> tag and a submit button are already included by JupyterHub, and should not
 * be generated here.
 */
function Form() {
  const profileList = window.profileList;

  // Currently, we only support a single profile, with many options.
  const profile = profileList[0];
  const { canSubmit } = useContext(SpawnerFormContext);

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
      <ResourceSelector profile={profile} />
      <input
        id="submit-button"
        type="submit"
        value="Start"
        disabled={!canSubmit}
        className="btn btn-jupyter form-control"
      />
    </div>
  );
}

const root = createRoot(document.getElementById("form"));
root.render(
  <SpawnerFormProvider>
    <Form />
  </SpawnerFormProvider>,
);
