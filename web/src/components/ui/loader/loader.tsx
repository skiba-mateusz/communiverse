import { NamedSize } from "@/types/styles";
import styled, { css } from "styled-components";

interface LoaderProps {
  size?: NamedSize;
}

const sizes = {
  small: css`
    width: var(--size-200);
    height: var(--size-200);
  `,
  medium: css`
    width: var(--size-500);
    height: var(--size-500);
  `,
  large: css`
    width: var(--size-600);
    height: var(--size-600);
  `,
};

const StyledLoader = styled.div`
  display: flex;
  gap: var(--size-200);
`;

const Circle = styled.div<LoaderProps>`
  ${({ size }) => sizes[size || "medium"]}
  border-radius: 100%;
  background-color: var(--clr-neutral-100);
  animation: beat 600ms ease-in-out infinite;

  &:nth-child(1) {
    animation-delay: 0ms;
  }
  &:nth-child(2) {
    animation-delay: 200ms;
  }
  &:nth-child(3) {
    animation-delay: 400ms;
  }

  @keyframes beat {
    0%,
    100% {
      transform: scale(1);
      background-color: var(--clr-neutral-200);
    }
    50% {
      transform: scale(1.25);
      background-color: var(--clr-neutral-100);
    }
  }
`;

export const Loader = ({ size = "small" }: LoaderProps) => {
  return (
    <StyledLoader aria-label="loading">
      <Circle size={size} />
      <Circle size={size} />
      <Circle size={size} />
    </StyledLoader>
  );
};
