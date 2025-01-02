import React, { useEffect, useId, useRef, useState } from "react";
import { ActionTypes, useTabs } from "./tabs-context";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";

interface TabsTriggerStyles extends React.PropsWithChildren {
  $active?: boolean;
  $styles?: Styles;
}

interface TabsTriggerProps extends React.PropsWithChildren, TabsTriggerStyles {
  value: string;
}

const StyledTabsTrigger = styled.button<TabsTriggerStyles>`
  ${({ theme, $active }) => css`
    flex: 1;
    height: 2.5rem;
    padding-block: ${theme.spacing(2)};
    flex: 1;
    background: ${$active ? `${theme.colors.neutral[50]}` : "transparent"};
    font-weight: bold;
    border: none;
    border-radius: ${theme.border.radius.sm};
  `}
`;

export const TabsTrigger = ({ $styles, value, children }: TabsTriggerProps) => {
  const {
    state: { activeValue },
    dispatch,
  } = useTabs();
  const id = useId();
  const ref = useRef<HTMLButtonElement>(null);

  const active = activeValue === value;

  useEffect(() => {
    dispatch({ type: ActionTypes.REGISTER_ITEM, payload: { ref, value, id } });

    return () => {
      dispatch({ type: ActionTypes.UNREGISTER_ITEM, payload: { id } });
    };
  }, [dispatch, value, id]);

  const handleClick = () => {
    dispatch({ type: ActionTypes.SELECT_ITEM, payload: { value } });
  };

  return (
    <StyledTabsTrigger
      $active={active}
      $styles={$styles}
      ref={ref}
      onClick={handleClick}
      id={`${id}-trigger-${value}`}
      aria-controls={`${id}-panel-${value}`}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      role="tab"
      type="button"
    >
      {children}
    </StyledTabsTrigger>
  );
};
