import styled, { css } from "styled-components";
import { TabsContextProvider } from "./tabs-context";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface TabsStyles {
  $styles?: Styles;
}

interface TabsProps extends React.PropsWithChildren, TabsStyles {
  defaultValue: string;
}

const StyledTabs = styled.div<TabsStyles>`
  ${({ theme, $styles }) => css`
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Tabs = ({ $styles, defaultValue, children }: TabsProps) => {
  return (
    <TabsContextProvider defaultValue={defaultValue}>
      <StyledTabs $styles={$styles} role="tabs">
        {children}
      </StyledTabs>
    </TabsContextProvider>
  );
};
