import React from "react";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface ContainerStyles {
  $styles?: Styles;
  $variant?: "full" | "wide" | "narrow";
}

interface ContainerProps extends React.PropsWithChildren, ContainerStyles {
  as?: React.ElementType;
}

const variants = {
  full: css`
    width: calc(100% - 2rem);
  `,
  wide: css`
    width: min(64rem, calc(100% - 2rem));
  `,
  narrow: css`
    width: min(42rem, calc(100% - 2rem));
  `,
};

export const StyledContainer = styled.div<ContainerStyles>`
  ${({ theme, $variant = "full", $styles }) => css`
    ${variants[$variant]};
    margin-inline: auto;
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Container = ({
  $styles,
  $variant,
  as,
  children,
  ...restProps
}: ContainerProps) => {
  return (
    <StyledContainer
      $styles={$styles}
      $variant={$variant}
      as={as}
      {...restProps}
    >
      {children}
    </StyledContainer>
  );
};
