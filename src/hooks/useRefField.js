import { useState, useEffect, useMemo } from "react";

function fetchRef(repository, refType) {
  return fetch(`https://api.github.com/repos/${repository}/${refType}`).then(
    (r) => {
      if (r.ok) return r.json();
    },
  );
}

export default function useRefField(repository, defaultValue) {
  const [value, setValue] = useState(defaultValue || "");
  const [options, setOptions] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();

  const selectedOption = useMemo(() => {
    if (!value || !options) return;
    return options.find((option) => option.value === value);
  }, [value, options]);

  useEffect(() => {
    setIsLoading(true);
    setOptions();
    if (repository) {
      Promise.all([
        fetchRef(repository, "branches"),
        fetchRef(repository, "tags"),
      ])
        .then((results) => {
          const refOptions = results.flat().map(({ name }) => ({
            label: name,
            value: name,
          }));
          setOptions(refOptions);
        })
        .finally(() => setIsLoading(false));
    }
  }, [repository]);

  const onChange = (e) => {
    setError();
    setValue(e.value);
  };

  const onBlur = () => {
    setError();
    if (!value) {
      setError("Select a git ref.");
    }
  };

  return {
    ref: value,
    refError: error,
    refIsLoading: isLoading,
    refFieldProps: {
      value: selectedOption,
      options,
      onChange,
      onBlur,
    },
  };
}
