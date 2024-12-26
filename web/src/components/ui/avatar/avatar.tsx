import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React from "react";
import styled, { css } from "styled-components";

interface AvatarStyles {
  $styles?: Styles;
}

interface AvatarProps extends React.PropsWithChildren, AvatarStyles {}

const StyledAvatar = styled.div<AvatarStyles>`
  ${({ theme, $styles }) => css`
    overflow: hidden;
    border-radius: 100%;
    width: fit-content;
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Avatar = ({ $styles, children, ...restProps }: AvatarProps) => {
  return (
    <StyledAvatar $styles={$styles} {...restProps}>
      {children}
    </StyledAvatar>
  );
};
