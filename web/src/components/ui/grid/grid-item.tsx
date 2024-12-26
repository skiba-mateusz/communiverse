import { ResponsiveStyle, Styles } from "@/types/styles";
import { parseStyles, responsive } from "@/utils/styles";
import React from "react";
import styled, { css } from "styled-components";

interface GridItemStyles {
  $span?: ResponsiveStyle;
  $styles?: Styles;
}

interface GridItemProps extends React.PropsWithChildren, GridItemStyles {
  as?: React.ElementType;
}

const computeSpan = (value: ResponsiveStyle) => {
  if (Array.isArray(value)) {
    return value.map((v) => `span ${v}`);
  }

  return `span: ${value}`;
};

export const StyledGridItem = styled.div<GridItemStyles>`
  ${({ theme, $span = 12, $styles }) => css`
    ${responsive("gridColumn", computeSpan($span), theme)}
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const GridItem = ({
  $span,
  $styles,
  as,
  children,
  ...restProps
}: GridItemProps) => {
  return (
    <StyledGridItem $span={$span} $styles={$styles} as={as} {...restProps}>
      {children}
    </StyledGridItem>
  );
};
