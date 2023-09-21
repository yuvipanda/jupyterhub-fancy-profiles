import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";

import "../node_modules/xterm/css/xterm.css";

import "./form.css";
import { ResourceSelector } from "./ResourceSelector";

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
  const [canStart, setCanStart] = useState(true);

  useEffect(() => {
    // The "Start" button that submits the form and launches the server is
    // rendered by JupyterHub itself, and we don't actually have *any* control
    // over it. But, we need to enable & disable it as appropriate based on
    // the state of the form, so we grab a reference to it with classical DOM manipulation.
    // However, this might break in future JupyterHub versions if the CSS structure changes
    const startButton = document.querySelector(".feedback-container input[type='submit']")
    startButton.disabled = !canStart;
  }, [canStart]);

  return (
    <>
      <input
        type="radio"
        className="hidden"
        name="profile"
        value={profile.slug}
        checked
        readOnly
      />
      <ResourceSelector profile={profile} setCanStart={setCanStart} />

    </>
  );
}

const root = createRoot(document.getElementById("form"));
root.render(<Form />);
