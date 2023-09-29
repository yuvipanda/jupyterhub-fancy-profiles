import { ProfileOption } from "./ProfileOption";
import { ImageOption } from "./ImageOption";

export function ResourceSelector({ profile }) {
  const options = profile.profile_options;
  return Object.keys(options).map((optionName) => {
    const OptionComponent =
      optionName === "image" ? ImageOption : ProfileOption;
    const optionBody = options[optionName];
    return (
      <OptionComponent
        key={optionName}
        optionName={optionName}
        displayName={optionBody.display_name}
        profileSlug={profile.slug}
        choices={optionBody.choices}
      />
    );
  });
}
