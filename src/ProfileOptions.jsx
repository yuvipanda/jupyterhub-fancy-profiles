import ResourceSelect from "./ResourceSelect";
import { ImageBuilder } from "./ImageBuilder";

export function ProfileOptions({ config, profile }) {
  return (
    <div className="form-grid">
      {Object.entries(config).map(([key, option]) => {
        const customOptions =
          key === "image"
            ? [
                {
                  value: "--extra-selectable-item",
                  label: "Build your own image",
                  description:
                    "Use a mybinder.org compatible GitHub repo to build your own image",
                  component: ImageBuilder,
                },
              ]
            : [];

        return (
          <ResourceSelect
            key={key}
            id={key}
            profile={profile}
            config={option}
            customOptions={customOptions}
          />
        );
      })}
    </div>
  );
}
