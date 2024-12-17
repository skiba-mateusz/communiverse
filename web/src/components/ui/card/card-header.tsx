import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React from "react";
import styled, { css } from "styled-components";
import { Heading } from "../typography";

interface CardHeaderProps {
  title: string;
  subheader?: string;
  avatar?: React.ReactNode;
  action?: React.ReactNode;
  styles?: Styles;
}

const StyledCardHeader = styled.header<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    padding: ${theme.spacing(4)};
    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const CardHeader = ({
  title,
  subheader,
  avatar,
  action,
  styles,
  ...restProps
}: CardHeaderProps) => {
  return (
    <StyledCardHeader styles={styles} {...restProps}>
      {avatar}
      <Heading as="h3">{title}</Heading>
    </StyledCardHeader>
  );
};
