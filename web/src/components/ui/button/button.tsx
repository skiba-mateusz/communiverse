import React from "react";
import styled, { css } from "styled-components";
import { Loader } from "../loader";
import { parseStyles } from "@/utils/styles";
import { Sizes, Styles } from "@/types/styles";
import { Link } from "react-router-dom";

type Variants = "filled" | "soft" | "outlined" | "transparent";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Sizes;
  variant?: Variants;
  full?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  styles?: Styles;
}

interface StylesProps {
  size: Sizes;
  variant: Variants;
  full: boolean;
  styles?: Styles;
}

export const getVariant = (theme: any, variant: Variants) => {
  switch (variant) {
    case "filled":
      return css`
        background-color: ${theme.colors.neutral[950]};
        color: ${theme.colors.neutral[50]};
      `;
    case "soft":
      return css`
        background-color: ${theme.colors.neutral[200]};
        &:hover {
          background-color: ${theme.colors.neutral[300]};
        }
      `;
    case "outlined":
      return css`
        background-color: transparent;
        border: 1px solid ${theme.colors.neutral[950]};
      `;
    case "transparent":
      return css`
        background-color: transparent;
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
        padding: ${theme.spacing(2)} ${theme.spacing(4)};
        font-size: ${theme.font.size.xs};
      `;
    case "medium":
      return css`
        padding: ${theme.spacing(4)} ${theme.spacing(6)};
        font-size: ${theme.font.size.sm};
      `;
    case "large":
      return css`
        padding: ${theme.spacing(6)} ${theme.spacing(8)};
        font-size: ${theme.font.size.md};
      `;
    default:
      return null;
  }
};

const styles = css<StylesProps>`
  ${({ theme, variant, size, full, styles }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(2)};
    text-transform: capitalize;
    font-weight: ${theme.font.weight.semi};
    border: none;
    border-radius: ${theme.border.radius.md};
    line-height: 1;
    transition: 100ms;

    ${getVariant(theme, variant)}
    ${getSize(theme, size)}
    ${full ? "width: 100%;" : ""}



    &:active {
      transform: scale(0.98);
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

const StyledLink = styled(Link)<StylesProps>`
  ${styles}
`;

const StyledButton = styled.button<StylesProps>`
  ${styles}
`;

export const Button = ({
  size = "medium",
  variant = "filled",
  full = false,
  isLoading = false,
  disabled = false,
  onClick,
  to,
  styles,
  children,
  ...restProps
}: ButtonProps) => {
  const handleClick = () => {
    if (isLoading || disabled) return;
    onClick?.();
  };

  const Component: React.ElementType = to ? StyledLink : StyledButton;

  return (
    <Component
      size={size}
      variant={variant}
      full={full}
      onClick={!to ? handleClick : undefined}
      disabled={!to && (disabled || isLoading)}
      to={to}
      styles={styles}
      {...restProps}
    >
      {isLoading ? <Loader /> : children}
    </Component>
  );
};
