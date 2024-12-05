import styled, { css } from "styled-components";
import { ResponsiveStyle, Styles } from "@/types/styles";
import { parseStyles, responsive } from "@/utils/styles";

interface FlowStyles {
  styles?: Styles;
  spacing?: ResponsiveStyle;
}

export const Flow = styled.div<FlowStyles>`
  ${({ theme, spacing, styles }) => css`
    & > * + * {
      ${responsive("marginTop", spacing, theme)};
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

Flow.displayName = "Flow";
