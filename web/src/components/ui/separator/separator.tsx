import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React from "react";

const directions = {
  horizontal: css`
    width: 100%;
    height: 1px;
  `,
  vertical: css`
    width: 1px;
    height: 100%;
  `,
};

interface SeparatorStyles {
  $styles?: Styles;
  $direction?: "horizontal" | "vertical";
}

interface SeparatorProps extends React.PropsWithChildren, SeparatorStyles {
  as?: React.ElementType;
}

export const StyledSeparator = styled.div<SeparatorStyles>`
  ${({ theme, $direction = "horizontal", $styles }) => css`
    background-color: ${theme.colors.neutral[400]};
    ${directions[$direction]}
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Separator = ({
  $direction,
  $styles,
  as,
  children,
  ...restProps
}: SeparatorProps) => {
  return (
    <StyledSeparator
      $direction={$direction}
      $styles={$styles}
      as={as}
      {...restProps}
    >
      {children}
    </StyledSeparator>
  );
};
