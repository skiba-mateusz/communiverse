import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardContentProps extends React.PropsWithChildren {
  styles?: Styles;
}

const StyledCardActions = styled.div<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    padding: 0 ${theme.spacing(4)} ${theme.spacing(4)} ${theme.spacing(4)};
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
