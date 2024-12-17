import { Sizes, Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import React from "react";
import styled, { css } from "styled-components";

const sizes = {
  small: css`
    height: 2rem;
    width: 2rem;
  `,
  medium: css`
    height: 4rem;
    width: 4rem;
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

const Wrapper = styled.div<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};

    & > span {
      font-weight: ${theme.font.weight.semi};
    }

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
    transition: 300ms;
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
        <StyledAvatar src={src} alt={alt} size={size} {...restProps} />
      </Hidden>
      {name ? <span>{name}</span> : ""}
    </Wrapper>
  );
};
