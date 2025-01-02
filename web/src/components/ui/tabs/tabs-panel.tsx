import React from "react";
import { useTabs } from "./tabs-context";
import { Styles } from "@/types/styles";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";

interface TabsPanelStyles extends React.PropsWithChildren {
  $styles?: Styles;
}

interface TabsPanelProps extends React.PropsWithChildren, TabsPanelStyles {
  value: string;
}

const StyledTabsPanel = styled.div<TabsPanelStyles>`
  ${({ theme, $styles }) => css`
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const TabsPanel = ({ $styles, value, children }: TabsPanelProps) => {
  const {
    state: { activeValue, items },
  } = useTabs();

  const activeItemId = items.find((item) => item.value === value)?.id;
  const isActive = value === activeValue;

  if (!isActive) return null;

  return (
    <StyledTabsPanel
      $styles={$styles}
      id={`${activeItemId}-panel-${value}`}
      aria-labelledby={`${activeItemId}-trigger-${value}`}
      role="tabpanel"
    >
      {children}
    </StyledTabsPanel>
  );
};
