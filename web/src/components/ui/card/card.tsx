import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardStyles {
  $styles?: Styles;
}

interface CardProps extends React.PropsWithChildren, CardStyles {}

const StyledCard = styled.article<CardStyles>`
  ${({ theme, $styles }) => {
    return css`
      position: relative;
      display: flex;
      flex-direction: column;
      border: 1px solid ${theme.colors.neutral[300]};
      border-radius: ${theme.border.radius.md};

      a {
        z-index: 2;
      }

      button {
        z-index: 3;
      }

      &:hover {
        border: 1px solid ${theme.colors.neutral[400]};
      }

      ${parseStyles({ ...$styles }, theme)}
    `;
  }}
`;

export const Card = ({ $styles, children, ...restProps }: CardProps) => {
  return (
    <StyledCard $styles={$styles} {...restProps}>
      {children}
    </StyledCard>
  );
};
