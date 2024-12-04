import styled, { css } from "styled-components";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface LinkProps extends RouterLinkProps {
  styles?: Styles;
}

export const Link = styled(RouterLink)<LinkProps>`
  ${({ theme, styles }) => css`
    color: ${theme.colors.blue[500]};
    font: inherit;
    ${parseStyles({ ...styles }, theme)}
  `}
`;
