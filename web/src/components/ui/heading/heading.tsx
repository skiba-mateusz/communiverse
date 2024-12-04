import React from "react";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface HeadingProps extends React.PropsWithChildren {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  styles?: Styles;
}

const getFontSize = (theme: any, as: HeadingProps["as"]) => {
  switch (as) {
    case "h1":
      return css`
        font-size: ${theme.font.size.xxl};
        @media (max-width: ${theme.breakpoints.sm}) {
          font-size: ${theme.font.size.xl};
        }
      `;
    case "h2":
      return css`
        font-size: ${theme.font.size.xl};
        @media (max-width: ${theme.breakpoints.sm}) {
          font-size: ${theme.font.size.lg};
        }
      `;
    case "h3":
      return css`
        font-size: ${theme.font.size.lg};
        @media (max-width: ${theme.breakpoints.sm}) {
          font-size: ${theme.font.size.md};
        }
      `;
    case "h4":
      return css`
        font-size: ${theme.font.size.md};
        @media (max-width: ${theme.breakpoints.sm}) {
          font-size: ${theme.font.size.sm};
        }
      `;
    case "h5":
      return css`
        font-size: ${theme.font.size.sm};
      `;
    case "h6":
      return css`
        font-size: ${theme.font.size.xs};
      `;
    default:
      return theme.font.size.sm;
  }
};

export const Heading = styled.h1<HeadingProps>`
  ${({ theme, as, styles }) => css`
    position: relative;
    padding-bottom: 0.2em;
    ${getFontSize(theme, as)};
    line-height: 1.25;

    &::before,
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 0.15em;
      display: block;
      border-radius: ${theme.border.radius.md};
    }

    &::before {
      width: 25%;
      background-color: ${theme.colors.neutral[600]};
      z-index: 2;
    }

    &::after {
      background-color: ${theme.colors.neutral[400]};
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

Heading.displayName = "Heading";
