import { useState, useEffect, useMemo } from "react";

export default function useRefField(repository) {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState();
  const [error, setError] = useState();

  const selectedOption = useMemo(() => {
    if (!value || !options) return;
    return options.find((option) => option.value === value);
  }, [value]);

  useEffect(() => {
    setOptions();
    if (repository) {
      fetch(`https://api.github.com/repos/${repository}/branches`)
        .then((r) => {
          if (r.ok) return r.json();
        })
        .then((r) => {
          const branchNames = r.map(({ name }) => ({
            label: name,
            value: name,
          }));
          setOptions(branchNames);
        });
    }
  }, [repository]);

  const onChange = (e) => {
    setError();
    setValue(e.value);
  };

  const onBlur = () => {
    setError();
    if (!value) {
      setError("Select a branch.");
    }
  };

  return {
    ref: value,
    refError: error,
    refFieldProps: {
      value: selectedOption,
      options,
      onChange,
      onBlur,
    },
  };
}
