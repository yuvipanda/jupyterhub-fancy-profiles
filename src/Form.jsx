import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";

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
  const profile = profileList[0];
  const startButton = useRef(
    document.querySelector(".feedback-container input[type='submit']")
  );

  const [canStart, setCanStart] = useState(true);

  useEffect(() => {
    startButton.current.disabled = !canStart;
  }, [canStart]);

  return (
    <>
      {/* We only support a single profile, and it must be marked as selected */}
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
