import React from "react";
import styled, { css } from "styled-components";
import { NamedSize } from "@/types/styles.ts";
import { Loader } from "../loader";

type Variant = "filled" | "outlined";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: NamedSize;
  variant?: Variant;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const variants = {
  filled: css`
    background-color: var(--clr-neutral-950);
    color: var(--clr-neutral-50);
  `,
  outlined: css`
    border: 1px solid var(--clr-neutral-950);
  `,
};

const sizes = {
  small: css`
    padding: var(--size-200) var(--size-300);
    font-size: var(--fs-50);
  `,
  medium: css`
    padding: var(--size-300) var(--size-400);
    font-size: var(--fs-100);
  `,
  large: css`
    padding: var(--size-400) var(--size-500);
    font-size: var(--fs-200);
  `,
};

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: none;
  border-radius: var(--size-100);
  line-height: 1;
  transition: 100ms;

  ${({ size }) => sizes[size || "medium"]}
  ${({ variant }) => variants[variant || "filled"]}

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const Button = ({
  size = "medium",
  variant = "filled",
  isLoading = false,
  disabled = false,
  onClick,
  children,
  ...restProps
}: ButtonProps) => {
  const handleClick = () => {
    if (isLoading || disabled) return;
    onClick?.();
  };

  return (
    <StyledButton
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...restProps}
    >
      {isLoading ? <Loader /> : children}
    </StyledButton>
  );
};
