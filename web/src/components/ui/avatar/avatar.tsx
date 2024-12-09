import { Sizes, Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React from "react";
import styled, { css } from "styled-components";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: Sizes;
  styles?: Styles;
}

const Wrapper = styled.div<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    ${parseStyles({ ...styles }, theme)}
    &:hover  img {
      scale: 1.1;
    }
    span {
      font-weight: ${theme.font.weight.semi};
    }
  `}
`;

const Hidden = styled.div`
  overflow: hidden;
  border-radius: 100%;
`;

const StyledAvatar = styled.img<{ size: Sizes }>`
  height: 2rem;
  width: 2rem;
  object-fit: cover;
  transition: 200ms;
`;

export const Avatar = ({
  name,
  size = "small",
  styles,
  src,
  alt,
  ...restProps
}: AvatarProps) => {
  return (
    <Wrapper styles={styles}>
      <Hidden>
        <StyledAvatar
          src={src}
          alt={alt}
          size={size}
          {...restProps}
        ></StyledAvatar>
      </Hidden>
      {name ? <span>{name}</span> : ""}
    </Wrapper>
  );
};
