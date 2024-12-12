import { NavLink as RouterNavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

export const NavLink = styled(RouterNavLink)<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    padding: ${theme.spacing(2)} ${theme.spacing(4)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    text-decoration: none;
    font-weight: ${theme.font.weight.medium};

    &.active,
    &:hover {
      background: ${theme.colors.neutral[200]};
    }

    @media (max-width: ${theme.breakpoints.lg}) {
      & > span {
        display: none;
      }

      & > svg {
        margin-inline: auto;
      }
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

NavLink.displayName = "NavLink";
