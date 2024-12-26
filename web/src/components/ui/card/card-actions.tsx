import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardStyles {
  $styles?: Styles;
}

interface CardContentProps extends React.PropsWithChildren, CardStyles {}

const StyledCardActions = styled.footer<CardStyles>`
  ${({ theme, $styles }) => css`
    padding: ${theme.spacing(4)};
    display: flex;
    align-items: center;
    justify-content: end;
    gap: ${theme.spacing(2)} ${parseStyles({ ...$styles }, theme)};
  `}
`;

export const CardActions = ({
  $styles,
  children,
  ...restProps
}: CardContentProps) => {
  return (
    <StyledCardActions $styles={$styles} {...restProps}>
      {children}
    </StyledCardActions>
  );
};
