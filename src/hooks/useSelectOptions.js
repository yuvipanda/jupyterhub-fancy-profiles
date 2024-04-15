import { useMemo } from "react";

function useSelectOptions(choices, extraChoices = []) {
  const options = useMemo(() => {
    const defaultChoices = Object.keys(choices).map((choiceName) => {
      return {
        value: choiceName,
        label: choices[choiceName].display_name,
        description: choices[choiceName].description,
      };
    });

    return [...defaultChoices, ...extraChoices];
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
