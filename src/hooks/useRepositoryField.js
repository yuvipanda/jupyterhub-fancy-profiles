import { useCallback, useState } from "react";

function extractOrgAndRepo(value) {
  let orgRepoString;
  const orgRepoMatch = /^[^/]+\/[^/]+$/.exec(value);

  if (orgRepoMatch) {
    orgRepoString = orgRepoMatch[0];
  } else {
    const fullUrlMatch =
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/((?:[^/]+\/[^/]+|[^/]+\/[^/]+)?)\/?$/.exec(
        value,
      );
    if (fullUrlMatch) {
      orgRepoString = fullUrlMatch[1];
    }
  }

  return orgRepoString;
}

export default function useRepositoryField() {
  const [value, setValue] = useState("");
  const [error, setError] = useState();
  const [repoId, setRepoId] = useState();

  const validate = async () => {
    setError();
    const orgRepoString = extractOrgAndRepo(value);

    if (!orgRepoString) {
      return "Provide the repository as the format 'organization/repository'.";
    }

    const repoExists = await fetch(
      `https://api.github.com/repos/${orgRepoString}`,
      {
        method: "HEAD",
      },
    ).then((r) => r.ok);

    if (!repoExists) {
      return "The repository doesn't exist or is not public.";
    }
  };

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onBlur = useCallback(async () => {
    setRepoId();
    const err = await validate();
    if (err) {
      setError(err);
    } else {
      setRepoId(extractOrgAndRepo(value));
    }
  }, [value]);

  return {
    repo: value,
    repoError: error,
    repoId,
    repoFieldProps: {
      value,
      onChange,
      onBlur,
    },
  };
}
