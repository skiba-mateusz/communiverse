import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";
import React from "react";

interface TypographyStyles {
  $styles?: Styles;
}

interface TypographyProps extends React.PropsWithChildren, TypographyStyles {
  as?: React.ElementType;
}

export const StyledTypography = styled.p<TypographyStyles>`
  ${({ theme, $styles }) => css`
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Typography = ({
  $styles,
  as,
  children,
  ...restProps
}: TypographyProps) => {
  return (
    <StyledTypography $styles={$styles} as={as} {...restProps}>
      {children}
    </StyledTypography>
  );
};
