import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardHeaderStyles {
  $styles?: Styles;
}

interface CardHeaderProps extends React.PropsWithChildren, CardHeaderStyles {}

const StyledCardHeader = styled.header<CardHeaderStyles>`
  ${({ theme, $styles }) => css`
    padding: ${theme.spacing(4)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(4)};
    flex-wrap: wrap;
    ${parseStyles({ ...$styles }, theme)};
  `}
`;

export const CardHeader = ({
  $styles,
  children,
  ...restProps
}: CardHeaderProps) => {
  return (
    <StyledCardHeader $styles={$styles} {...restProps}>
      {children}
    </StyledCardHeader>
  );
};
