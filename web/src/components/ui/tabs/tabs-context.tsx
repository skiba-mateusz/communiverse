import React, { createContext, useContext, useMemo, useReducer } from "react";

export enum ActionTypes {
  REGISTER_ITEM = "REGISTER_ITEM",
  UNREGISTER_ITEM = "UNREGISTER_ITEM",
  SELECT_ITEM = "SELECT_ITEM",
  NEXT_ITEM = "NEXT_ITEM",
  PREV_ITEM = "PREV_ITEM",
}

export type RegisterItemAction = {
  type: ActionTypes.REGISTER_ITEM;
  payload: {
    ref: React.RefObject<HTMLButtonElement>;
    value: string;
    id: string;
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

export type NextItemAction = {
  type: ActionTypes.NEXT_ITEM;
};

export type PrevItemAction = {
  type: ActionTypes.PREV_ITEM;
};

export type Actions =
  | RegisterItemAction
  | UnregisterItemAction
  | SelectItemAction
  | NextItemAction
  | PrevItemAction;

interface State {
  items: {
    ref: React.RefObject<HTMLButtonElement>;
    value: string;
    id: string;
  }[];
  activeValue: string;
}

interface TabsContext {
  state: State;
  dispatch: React.Dispatch<Actions>;
}

const TabsContext = createContext<TabsContext | undefined>(undefined);

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case ActionTypes.REGISTER_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case ActionTypes.UNREGISTER_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case ActionTypes.SELECT_ITEM:
      return {
        ...state,
        activeValue: action.payload.value,
      };
    case ActionTypes.NEXT_ITEM:
      const nextActiveItemIndex = state.items.findIndex(
        (item) => item.value === state.activeValue
      );

      let nextItemValue;
      if (nextActiveItemIndex === state.items.length - 1) {
        nextItemValue = state.items[0].value;
      } else {
        nextItemValue = state.items[nextActiveItemIndex + 1].value;
      }

      return { ...state, activeValue: nextItemValue };
    case ActionTypes.PREV_ITEM:
      const prevActiveItemIndex = state.items.findIndex(
        (item) => item.value === state.activeValue
      );

      let prevItemValue;
      if (prevActiveItemIndex === 0) {
        prevItemValue = state.items[state.items.length - 1].value;
      } else {
        prevItemValue = state.items[prevActiveItemIndex - 1].value;
      }

      return { ...state, activeValue: prevItemValue };
    default:
      return state;
  }
};

interface TabsProviderProps extends React.PropsWithChildren {
  defaultValue: string;
}

export const TabsContextProvider = ({
  defaultValue,
  children,
}: TabsProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    activeValue: defaultValue,
  });

  const memoizedState = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <TabsContext.Provider value={memoizedState}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContext used outside its provider");
  }
  return context;
};
