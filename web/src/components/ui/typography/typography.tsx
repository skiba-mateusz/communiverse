import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface TypographyStyles {
  styles?: Styles;
}

export const Typography = styled.p<TypographyStyles>`
  ${({ theme, styles }) => css`
    ${parseStyles({ ...styles }, theme)}
  `}
`;

Typography.displayName = "Typography";
