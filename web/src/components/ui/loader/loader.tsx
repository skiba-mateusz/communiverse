import styled, { css } from "styled-components";
import { Sizes, Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

const sizes = {
  small: css`
    width: 1rem;
    height: 1rem;
  `,
  medium: css`
    width: 1.5rem;
    height: 1.5rem;
  `,
  large: css`
    width: 2rem;
    height: 2rem;
  `,
};

interface LoaderStyles {
  $size?: Sizes;
  $styles?: Styles;
}

interface LoaderProps extends LoaderStyles {}

const StyledLoader = styled.div<Omit<LoaderStyles, "size">>`
  ${({ theme, $styles }) => css`
    padding: ${theme.spacing(4)};
    display: flex;
    justify-self: center;
    gap: ${theme.spacing(3)};
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

const Circle = styled.div<Omit<LoaderStyles, "styles">>`
  ${({ theme, $size = "small" }) => css`
    ${sizes[$size]}
    border-radius: 100%;
    background-color: ${theme.colors.neutral[400]};
    animation: beat 750ms ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0ms;
    }
    &:nth-child(2) {
      animation-delay: 250ms;
    }
    &:nth-child(3) {
      animation-delay: 500ms;
    }

    @keyframes beat {
      0%,
      100% {
        transform: scale(1);
        background-color: ${theme.colors.neutral[400]};
      }
      50% {
        transform: scale(1.25);
        background-color: ${theme.colors.neutral[200]};
      }
    }
  `}
`;

export const Loader = ({ $size, $styles }: LoaderProps) => {
  return (
    <StyledLoader $styles={$styles} aria-label="loading">
      {Array.from({ length: 3 }, (_, i) => (
        <Circle $size={$size} key={i} />
      ))}
    </StyledLoader>
  );
};
