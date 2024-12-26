import styled, { css } from "styled-components";
import { ResponsiveStyle, Styles } from "@/types/styles";
import { parseStyles, responsive } from "@/utils/styles";

interface GridStyles {
  $spacing?: ResponsiveStyle;
  $styles?: Styles;
}

export const Grid = styled.div<GridStyles>`
  ${({ theme, $spacing = [4, 8, 12], $styles }) => css`
    display: grid;
    grid-template-columns: repeat(${theme.grid.columns}, minmax(0px, 1fr));
    ${responsive("gap", $spacing, theme)};
    ${parseStyles({ ...$styles }, theme)};
  `}
`;

Grid.displayName = "Grid";
