import { useMemo } from "react";

function useSelectOptions(config, customOptions = []) {
  const { choices, unlisted_choice } = config;

  const options = useMemo(() => {
    const defaultChoices = Object.keys(choices).map((choiceName) => {
      return {
        value: choiceName,
        label: choices[choiceName].display_name,
        description: choices[choiceName].description,
      };
    });

    const extraChoices = [];
    if (unlisted_choice?.enabled) {
      extraChoices.push({
        value: "unlisted_choice",
        label: unlisted_choice.display_name_in_choices,
        description: unlisted_choice.description_in_choices,
      });
    }

    return [...defaultChoices, ...extraChoices, ...customOptions];
  }, [choices]);

  const defaultChoiceName =
    Object.keys(choices).find((choiceName) => choices[choiceName].default) ||
    Object.keys(choices)[0];

  const defaultOption = options.find(
    (option) => option.value === defaultChoiceName,
  );

  return {
    options,
    defaultOption,
  };
}

export default useSelectOptions;
