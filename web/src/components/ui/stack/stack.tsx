import styled, { css } from "styled-components";
import { ResponsiveStyle, Styles } from "@/types/styles";
import { parseStyles, responsive } from "@/utils/styles";
import React from "react";

interface FlowStyles {
  $styles?: Styles;
  $direction?: "horizontal" | "vertical";
  $spacing?: ResponsiveStyle;
}

interface FlowProps extends React.PropsWithChildren, FlowStyles {
  as?: React.ElementType;
}

export const StyledStack = styled.div<FlowStyles>`
  ${({
    theme,
    $spacing = [4, 6, 6],
    $direction = "horizontal",
    $styles,
  }) => css`
    display: flex;
    flex-direction: ${$direction === "horizontal" ? "row" : "column"};
    flex-wrap: wrap;
    ${responsive("gap", $spacing, theme)}
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Stack = ({
  $styles,
  $direction,
  $spacing,
  as,
  children,
  ...restProps
}: FlowProps) => {
  return (
    <StyledStack
      $styles={$styles}
      $direction={$direction}
      $spacing={$spacing}
      as={as}
      {...restProps}
    >
      {children}
    </StyledStack>
  );
};
