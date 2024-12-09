import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface StyleProps {
  styles?: Styles;
}

interface CardProps extends React.PropsWithChildren, StyleProps {}

const StyledCard = styled.article<StyleProps>`
  ${({ theme, styles }) => css`
    position: relative;
    border: 1px solid ${theme.colors.neutral[300]};
    border-radius: ${theme.border.radius.md};

    &:hover {
      border: 1px solid ${theme.colors.neutral[400]};
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const Card = ({ hoverEffect = false, children }: CardProps) => {
  return <StyledCard>{children}</StyledCard>;
};
