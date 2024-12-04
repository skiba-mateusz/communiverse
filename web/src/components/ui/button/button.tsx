import React from "react";
import styled, { css } from "styled-components";
import { Loader } from "../loader";
import { parseStyles } from "@/utils/styles";
import { Sizes, Styles } from "@/types/styles";

type Variants = "filled" | "outlined" | "transparent";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Sizes;
  variant?: Variants;
  full?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  styles?: React.CSSProperties | { [key in keyof React.CSSProperties]: any };
}

const getVariant = (theme: any, variant: Variants) => {
  switch (variant) {
    case "filled":
      return css`
        background-color: ${theme.colors.neutral[950]};
        color: ${theme.colors.neutral[50]};
      `;
    case "outlined":
      return css`
        border: 1px solid ${theme.colors.neutral[950]};
      `;
    case "transparent":
      return css`
        background: transparent;
        border: none;
      `;

    default:
      throw new Error(`unknown variant: ${variant}`);
  }
};

export const getSize = (theme: any, size: Sizes) => {
  switch (size) {
    case "small":
      return css`
        font-size: ${theme.font.size.xs};
      `;
    case "medium":
      return css`
        font-size: ${theme.font.size.sm};
      `;
    case "large":
      return css`
        font-size: ${theme.font.size.md};
      `;
    default:
      return null;
  }
};

const StyledButton = styled.button<{
  size: Sizes;
  variant: Variants;
  full: boolean;
  styles?: Styles;
}>`
  ${({ theme, variant, size, full, styles }) => css`
    padding: 0.9em 1.8em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: capitalize;
    font-weight: ${theme.font.weight.semi};
    border: none;
    border-radius: ${theme.border.radius.md};
    line-height: 1;
    transition: 100ms;

    ${getVariant(theme, variant)}
    ${getSize(theme, size)}
    ${full ? "width: 100%;" : ""}

    &:hover {
      opacity: 0.8;
    }

    &:active {
      transform: scale(0.98);
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const Button = ({
  size = "medium",
  variant = "filled",
  full = false,
  isLoading = false,
  disabled = false,
  onClick,
  styles,
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
      full={full}
      onClick={handleClick}
      disabled={disabled || isLoading}
      styles={styles}
      {...restProps}
    >
      {isLoading ? <Loader /> : children}
    </StyledButton>
  );
};
