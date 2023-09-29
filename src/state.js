import { createContext, useReducer } from "react";

const IMAGE_OPTION_VIEWS = {
  choices: Symbol("choices"),
  specifier: Symbol("specifier"),
  builder: Symbol("builder"),
};

const INITIAL_STATE = {
  canSubmit: true,
  unlistedImage: "",
  imageOptionView: IMAGE_OPTION_VIEWS.choices,
};

const ACTION_TYPES = {
  SET_UNLISTED_IMAGE: Symbol("set-unlisted-image"),
  SET_IMAGE_OPTION_VIEW: Symbol("set-image-option-view"),
};

function reducer(oldState, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_IMAGE_OPTION_VIEW:
      return {
        ...oldState,
        imageOptionView: action.payload,
        canSubmit:
          action.payload == IMAGE_OPTION_VIEWS.choices ||
          oldState.unlistedImage !== "",
      };
    case ACTION_TYPES.SET_UNLISTED_IMAGE:
      return {
        ...oldState,
        unlistedImage: action.payload,
        canSubmit:
          oldState.imageOptionView == IMAGE_OPTION_VIEWS.choices ||
          action.payload !== "",
      };
    default:
      throw new Error();
  }
}

const SpawnerFormContext = createContext();

const SpawnerFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // These can be destructured out by any child element
  const value = {
    canSubmit: state.canSubmit,
    imageOptionView: state.imageOptionView,
    unlistedImage: state.unlistedImage,
    setUnlistedImage: (unlistedImage) => {
      dispatch({
        type: ACTION_TYPES.SET_UNLISTED_IMAGE,
        payload: unlistedImage,
      });
    },
    setImageOptionView: (imageOptionView) => {
      dispatch({
        type: ACTION_TYPES.SET_IMAGE_OPTION_VIEW,
        payload: imageOptionView,
      });
    },
  };

  return (
    <SpawnerFormContext.Provider value={value}>
      {children}
    </SpawnerFormContext.Provider>
  );
};

export { SpawnerFormContext, SpawnerFormProvider, IMAGE_OPTION_VIEWS };
