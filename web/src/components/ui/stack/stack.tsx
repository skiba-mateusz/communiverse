import styled, { css } from "styled-components";
import { ResponsiveStyle, Styles } from "@/types/styles";
import { parseStyles, responsive } from "@/utils/styles";

interface FlowStyles {
  styles?: Styles;
  direction?: "horizontal" | "vertical";
  spacing?: ResponsiveStyle;
}

export const Stack = styled.div<FlowStyles>`
  ${({ theme, spacing = [4, 6, 6], direction = "horizontal", styles }) => css`
    display: flex;
    flex-direction: ${direction === "horizontal" ? "row" : "column"};
    ${responsive("gap", spacing, theme)}
    ${parseStyles({ ...styles }, theme)}
  `}
`;

Stack.displayName = "Stack";
