import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Sizes, Styles } from "@/types/styles";
import { getColorFromValue, parseStyles } from "@/utils/styles";
import { Image } from "../image";

const sizes = {
  small: {
    height: 32,
    width: 32,
  },
  medium: {
    height: 64,
    width: 64,
  },
  large: {
    height: 96,
    width: 96,
  },
};

const StyledAvatarImage = styled(Image)<{ $styles?: Styles }>`
  ${({ theme, $styles }) => css`
    aspect-ratio: 1/1;
    transition: 300ms;

    &:hover {
      scale: 1.1;
      opacity: 0.9;
    }

    ${parseStyles({ ...$styles }, theme)}
  `}
`;

const Fallback = styled.div<{
  $styles?: Styles;
  $height: number;
  $width: number;
  $bgcolor: string;
}>`
  ${({ theme, $height, $width, $bgcolor, $styles }) => css`
    width: ${$width}px;
    height: ${$height}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${$bgcolor};
    font-size: ${$width / 32}rem;
    font-weight: ${theme.font.weight.bold};
    transition: 300ms;

    &:hover {
      transform: scale(1.1);
      opacity: 0.9;
    }

    ${parseStyles({ ...$styles }, theme)}
  `}
`;

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  $styles?: Styles;
  $size?: Sizes;
  fallback: string;
}

export const AvatarImage = ({
  $size = "small",
  $styles = { borderRadius: "100%" },
  src,
  alt,
  fallback,
  ...restProps
}: AvatarImageProps) => {
  const [hasError, setHasError] = useState(false);
  const bgcolor = getColorFromValue(fallback);
  const { width, height } = sizes[$size];

  if (!src || hasError)
    return (
      <Fallback
        $styles={$styles}
        $height={height}
        $width={width}
        $bgcolor={bgcolor}
        aria-label={alt}
      >
        {fallback.charAt(0).toUpperCase()}
      </Fallback>
    );

  return (
    <StyledAvatarImage
      $styles={$styles}
      height={height}
      width={width}
      src={src}
      onError={() => setHasError(true)}
      alt={alt}
      {...restProps}
    />
  );
};
