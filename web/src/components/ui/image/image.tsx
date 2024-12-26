import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  $styles?: Styles;
}

const Skeleton = styled.div<{
  $styles?: Styles;
  $width?: string | number;
  $height?: string | number;
}>`
  ${({ theme, $styles, $width = "100%", $height = "auto" }) => css`
    width: ${$width}px;
    max-width: 100%;
    height: auto;
    aspect-ratio: ${Number($width) / Number($height)};
    background-color: ${theme.colors.neutral[200]};
    border-radius: ${theme.border.radius.md};
    animation: pulse 1.5s infinite;

    @keyframes pulse {
      0% {
        background-color: ${theme.colors.neutral[200]};
      }
      50% {
        background-color: ${theme.colors.neutral[300]};
      }
      100% {
        background-color: ${theme.colors.neutral[200]};
      }
    }

    ${parseStyles({ ...$styles }, theme)}
  `}
`;

const StyledImage = styled.img<{ $fadeIn: boolean; $styles?: Styles }>`
  ${({ theme, $styles, $fadeIn }) => css`
    height: auto;
    border-radius: ${theme.border.radius.md};

    ${$fadeIn &&
    css`
      animation: fadeIn 500ms;
    `}

    @keyframes fadeIn {
      from {
        filter: blur(8px);
      }
      to {
        filter: blur(0);
      }
    }

    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Image = ({
  $styles,
  src,
  height,
  width,
  loading = "lazy",
  ...restProps
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new window.Image();
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
      setIsCached(true);
    } else {
      img.onload = () => {
        setIsLoaded(true);
        setIsCached(false);
      };
    }

    return () => {
      img.onload = null;
    };
  }, [src]);

  return isLoaded ? (
    <StyledImage
      $fadeIn={!isCached}
      $styles={$styles}
      src={src}
      height={height}
      width={width}
      loading={loading}
      {...restProps}
    />
  ) : (
    <Skeleton
      $width={width}
      $height={height}
      $styles={$styles}
      aria-label="loading"
    />
  );
};
