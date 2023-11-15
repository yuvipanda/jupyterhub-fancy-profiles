import { createContext, useReducer } from "react";

const INITIAL_STATE = {
  canSubmit: false,
  optionValues: {},
  profileSlug: "",
};

const ACTION_TYPES = {
  SET_OPTION_VALUE: Symbol("set-choice"),
  SET_PROFILE_SLUG: Symbol("set-profile-slug"),
};

export const CHOICE_TYPE = {
  LISTED: Symbol("listed"),
  UNLISTED: Symbol("unlisted"),
};

/**
 * Return true if optionValues can be posted
 *
 * Currently only says 'invalid' when user has an unlisted choice chosen but empty.
 *
 * @param {object} optionValues
 */
function validateOptionValues(optionValues) {
  for (const key of Object.keys(optionValues)) {
    const value = optionValues[key];
    if (value.type === CHOICE_TYPE.UNLISTED) {
      if (value.value.trim() === "") {
        return false;
      }
    }
  }
  return true;
}

function reducer(oldState, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_OPTION_VALUE: {
      const name = action.name;
      const value = action.value;
      const optionValues = {
        ...oldState.optionValues,
        [name]: value,
      };
      const newState = {
        ...oldState,
        canSubmit: validateOptionValues(optionValues),
        optionValues: optionValues,
      };
      console.log(newState);
      return newState;
    }
    case ACTION_TYPES.SET_PROFILE_SLUG: {
      return {
        ...oldState,
        profileSlug: action.profileSlug,
      };
    }
    default:
      throw new Error();
  }
}

export const SpawnerFormContext = createContext();

export const SpawnerFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // These can be destructured out by any child element
  const value = {
    canSubmit: state.canSubmit,
    setOptionValue: (name, type, value) => {
      dispatch({
        type: ACTION_TYPES.SET_OPTION_VALUE,
        name: name,
        value: {
          type: type,
          value: value,
        },
      });
    },
    /**
     * @param {string} profileSlug Slug identifying current profile
     */
    setProfileSlug: (profileSlug) => {
      dispatch({
        type: ACTION_TYPES.SET_PROFILE_SLUG,
        profileSlug: profileSlug,
      });
    },
    /**
     * Get formatted form values for support
     *
     * @returns {Map<string, string>}
     */
    getFormValues: () => {},
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};
