import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardContentProps extends React.PropsWithChildren {
  styles?: Styles;
}

const StyledCardActions = styled.footer<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    padding: ${theme.spacing(4)};
    display: flex;
    align-items: center;
    justify-content: end;
    gap: ${theme.spacing(2)} ${parseStyles({ ...styles }, theme)};
  `}
`;

export const CardActions = ({
  children,
  styles,
  ...restProps
}: CardContentProps) => {
  return (
    <StyledCardActions styles={styles} {...restProps}>
      {children}
    </StyledCardActions>
  );
};
