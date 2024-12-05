import { ResponsiveStyle, Styles } from "@/types/styles";
import { parseStyles, responsive } from "@/utils/styles";
import styled, { css } from "styled-components";

interface GridItemStyles {
  span?: ResponsiveStyle;
  styles?: Styles;
}

const computeSpan = (value: ResponsiveStyle) => {
  if (Array.isArray(value)) {
    return value.map((v) => `span ${v}`);
  }

  return `span: ${value}`;
};

export const GridItem = styled.div<GridItemStyles>`
  ${({ theme, span = 12, styles }) => css`
    ${responsive("gridColumn", computeSpan(span), theme)}
    ${parseStyles({ ...styles }, theme)}
  `}
`;

GridItem.displayName = "GridItem";
