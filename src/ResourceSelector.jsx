import { ProfileOption } from "./ProfileOption";
import { ImageBuilder } from "./ImageBuilder";

export function ResourceSelector({ profile }) {
  const options = profile.profile_options;
  return Object.keys(options).map((optionName) => {
    const optionBody = options[optionName];
    return (
      <ProfileOption
        key={optionName}
        unlistedChoice={optionBody.unlisted_choice}
        optionName={optionName}
        displayName={optionBody.display_name}
        profileSlug={profile.slug}
        choices={optionBody.choices}
        extraSelectableItem={
          optionName === "image" && {
            display_name_in_choices: "Build your own image",
            description_in_choices:
              "Use a mybinder.org compatible GitHub repo to build your own image",
            component: ImageBuilder,
          }
        }
      />
    );
  });
}
