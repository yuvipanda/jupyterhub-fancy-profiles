import { useEffect, useState } from "react";

export function ImageSpecifier({ visible, setUnlistedImage }) {
  const [specifiedImage, setSpecifiedImage] = useState("");
  useEffect(() => {
    console.log("visibility triggered");
    console.log(visible);
    if (!visible) {
      setUnlistedImage("");
    }
  }, [visible]);
  return (
    visible && (
      <>
        <div className="profile-option-label-container">
          <label>Custom Image</label>
        </div>
        <div className="profile-option-control-container">
          {/* Save and restore the typed in value, so we don't lose it if the user selects another choice */}
          <input
            type="text"
            defaultValue={specifiedImage}
            onChange={(ev) => {
              const val = ev.target.value;
              setSpecifiedImage(val);
              setUnlistedImage(val);
            }} />
        </div>
      </>
    )
  );
}
