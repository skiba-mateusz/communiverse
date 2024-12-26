import React from "react";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface BoxStyles {
  $styles?: Styles;
}

interface BoxProps extends React.PropsWithChildren, BoxStyles {
  as?: React.ElementType;
}

export const StyledBox = styled.div<BoxStyles>`
  ${({ theme, $styles }) => css`
    padding: ${theme.spacing(4)};
    border: 1px solid ${theme.colors.neutral[300]};
    border-radius: ${theme.border.radius.md};
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Box = ({ $styles, as, children, ...restProps }: BoxProps) => {
  return (
    <StyledBox $styles={$styles} as={as} {...restProps}>
      {children}
    </StyledBox>
  );
};
