import { useContext } from "react";
import { useEffect, useState } from "react";
import { SpawnerFormContext } from "./state";

export function ImageSpecifier({ visible }) {
  const [specifiedImage, setSpecifiedImage] = useState("");

  const { setUnlistedImage } = useContext(SpawnerFormContext);
  useEffect(() => {
    console.log("visibility triggered");
    console.log(visible);
    if (!visible) {
      setUnlistedImage("");
    } else {
      setUnlistedImage(specifiedImage);
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
            }}
          />
        </div>
      </>
    )
  );
}
