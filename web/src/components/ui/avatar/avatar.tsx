import { Sizes, Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React from "react";
import styled, { css } from "styled-components";

const sizes = {
  small: css`
    height: 1.5rem;
    width: 1.5rem;
  `,
  medium: css`
    height: 3rem;
    width: 3rem;
  `,
  large: css`
    height: 6rem;
    width: 6rem;
  `,
};

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: Sizes;
  styles?: Styles;
}

const Wrapper = styled.div<{ styles: Styles }>`
  ${({ theme, styles }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    &:hover img {
      scale: 1.1;
    }
    ${parseStyles({ ...styles }, theme)}
  `}
`;

const Hidden = styled.div`
  overflow: hidden;
  border-radius: 100%;
`;

const StyledAvatar = styled.img<{ size: Sizes }>`
  ${({ size }) => css`
    ${sizes[size]}
    object-fit: cover;
    transition: 200ms;
  `}
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
