import { ProfileOption } from "./ProfileOption";
import { ImageOption } from "./ImageOption";

export function ResourceSelector({ profile, setCanStart }) {
  const options = profile.profile_options;
  return (
    <div className="resource-selector">
      {Object.keys(options).map((optionName) => {
        const OptionComponent = optionName === "image" ? ImageOption : ProfileOption;
        const optionBody = options[optionName];
        return (
          <OptionComponent
            setCanStart={setCanStart}
            key={optionName}
            optionName={optionName}
            displayName={optionBody.display_name}
            profileSlug={profile.slug}
            choices={optionBody.choices} />
        );
      })}
    </div>
  );
}
