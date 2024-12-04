import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface FlowStyles {
  styles?: Styles;
  spacing?: number;
}

export const Flow = styled.div<FlowStyles>`
  ${({ theme, spacing, styles }) => css`
    & > * + * {
      margin-top: ${spacing ? theme.spacing(spacing) : "1em"};
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

Flow.displayName = "Flow";
