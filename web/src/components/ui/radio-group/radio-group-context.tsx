import React, { createContext, useContext, useMemo, useReducer } from "react";

export enum ActionTypes {
  REGISTER_ITEM = "REGISTER_ITEM",
  UNREGISTER_ITEM = "UNREGISTER_ITEM",
  SELECT_ITEM = "SELECT_ITEM",
}

export type RegisterItemAction = {
  type: ActionTypes.REGISTER_ITEM;
  payload: {
    id: string;
    value: string;
    ref: React.RefObject<HTMLButtonElement>;
  };
};

export type UnregisterItemAction = {
  type: ActionTypes.UNREGISTER_ITEM;
  payload: {
    id: string;
  };
};

export type SelectItemAction = {
  type: ActionTypes.SELECT_ITEM;
  payload: {
    value: string;
  };
};

type Actions = RegisterItemAction | UnregisterItemAction | SelectItemAction;

interface State {
  activeValue: string;
  items: {
    ref: React.RefObject<HTMLButtonElement>;
    value: string;
    id: string;
  }[];
}

interface TabsContext {
  state: State;
  dispatch: React.Dispatch<Actions>;
}

const RadioGroupContext = createContext<TabsContext | undefined>(undefined);

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.REGISTER_ITEM:
      return { ...state, items: [...state.items, action.payload] };
    case ActionTypes.UNREGISTER_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case ActionTypes.SELECT_ITEM:
      return { ...state, activeValue: action.payload.value };
    default:
      return state;
  }
};

interface RadioGroupContextProviderProps extends React.PropsWithChildren {
  defaultValue: string;
}

export const RadioGroupContextProvider = ({
  defaultValue,
  children,
}: RadioGroupContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    activeValue: defaultValue,
    items: [],
  });

  const memoizedState = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <RadioGroupContext.Provider value={memoizedState}>
      {children}
    </RadioGroupContext.Provider>
  );
};

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupContext used outside its provider");
  }
  return context;
};
