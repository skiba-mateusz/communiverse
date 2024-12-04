import React from "react";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";

interface BoxStyles {
  styles?: React.CSSProperties | { [key in keyof React.CSSProperties]: any };
}

export const Box = styled.div<BoxStyles>`
  ${({ theme, styles }) => css`
    padding: ${theme.spacing(4)};
    border: 1px solid ${theme.colors.neutral[300]};
    border-radius: ${theme.border.radius.md};
    ${parseStyles({ ...styles }, theme)}
  `}
`;

Box.displayName = "Box";
