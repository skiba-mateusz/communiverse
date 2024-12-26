import React from "react";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface HeadingStyles {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  $underlined?: boolean;
  $styles?: Styles;
}

interface HeadingProps extends React.PropsWithChildren, HeadingStyles {}

const getFontSize = (theme: any, as: HeadingStyles["as"]) => {
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

export const StyledHeading = styled.h1<HeadingStyles>`
  ${({ theme, as, $underlined = false, $styles }) => css`
    position: relative;
    ${getFontSize(theme, as)};
    line-height: 1.25;

    ${$underlined
      ? css`
          padding-bottom: 0.2em;
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
        `
      : ""}

    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Heading = ({
  $styles,
  $underlined,
  as,
  children,
  ...restProps
}: HeadingProps) => {
  return (
    <StyledHeading
      $styles={$styles}
      $underlined={$underlined}
      as={as}
      {...restProps}
    >
      {children}
    </StyledHeading>
  );
};
