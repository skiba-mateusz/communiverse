import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardContentProps extends React.PropsWithChildren {
  styles?: Styles;
}

const StyledCardContent = styled.div<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    padding-inline: ${theme.spacing(4)};
    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const CardContent = ({
  children,
  styles,
  ...restProps
}: CardContentProps) => {
  return (
    <StyledCardContent styles={styles} {...restProps}>
      {children}
    </StyledCardContent>
  );
};
