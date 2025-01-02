import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { ActionTypes, useTabs } from "./tabs-context";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface TabsListStyles {
  $styles?: Styles;
}

interface TabsListProps extends React.PropsWithChildren, TabsListStyles {}

const StyledTabsList = styled.div<TabsListStyles>`
  ${({ theme, $styles }) => css`
    padding: ${theme.spacing(1)};
    display: flex;
    gap: ${theme.spacing(2)};
    background: ${theme.colors.neutral[200]};
    border-radius: ${theme.border.radius.md};
    transition: 300ms;
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const TabsList = ({ $styles, children }: TabsListProps) => {
  const {
    state: { items, activeValue },
    dispatch,
  } = useTabs();
  const isFocusable = useRef(false);

  useEffect(() => {
    if (!isFocusable.current) {
      return;
    }

    const activeItem = items.find((item) => item.value === activeValue);
    if (activeItem?.ref?.current) {
      activeItem.ref.current.focus();
    }
  }, [activeValue, items]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        dispatch({ type: ActionTypes.NEXT_ITEM });
        break;
      case "ArrowLeft":
        dispatch({ type: ActionTypes.PREV_ITEM });
        break;
    }
    if (!isFocusable.current) {
      isFocusable.current = true;
    }
  };

  return (
    <StyledTabsList $styles={$styles} role="tabslist" onKeyDown={handleKeyDown}>
      {children}
    </StyledTabsList>
  );
};
