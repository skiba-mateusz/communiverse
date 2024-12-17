import React from "react";
import styled, { css } from "styled-components";
import { Loader } from "../loader";
import { parseStyles } from "@/utils/styles";
import { Sizes, Styles } from "@/types/styles";
import { Link } from "react-router-dom";

type Variants = "filled" | "soft" | "outlined" | "transparent";
type ButtonSizes = Sizes | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSizes;
  variant?: Variants;
  full?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
  styles?: Styles;
}

interface StylesProps {
  size: ButtonSizes;
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
        &:hover {
          opacity: 1;
          background-color: ${theme.colors.neutral[200]};
        }
      `;
    default:
      throw new Error(`unknown variant: ${variant}`);
  }
};

export const getSize = (theme: any, size: ButtonSizes) => {
  switch (size) {
    case "small":
      return css`
        height: 2.25rem;
        padding-inline: ${theme.spacing(2)};
        font-size: ${theme.font.size.xs};
      `;
    case "medium":
      return css`
        height: 2.5rem;
        padding-inline: ${theme.spacing(3)};
      `;
    case "large":
      return css`
        height: 2.75rem;
        padding-inline: ${theme.spacing(4)};
      `;
    case "icon":
      return css`
        height: 2.5rem;
        width: 2.5rem;
      `;
    default:
      throw new Error(`unknown size: ${size}`);
  }
};

const styles = css<StylesProps>`
  ${({ theme, variant, size, full, styles }) => css`
    padding-block: ${theme.spacing(2)};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing(2)};
    text-transform: capitalize;
    font-weight: ${theme.font.weight.semi};
    border: none;
    border-radius: ${theme.border.radius.md};
    transition: 200ms;

    &:hover {
      opacity: 0.9;
    }
    &:active {
      transform: scale(0.98);
    }

    ${getVariant(theme, variant)}
    ${getSize(theme, size)}
    ${full ? "width: 100%;" : ""}

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
      {isLoading ? <Loader styles={{ padding: 0 }} /> : children}
    </Component>
  );
};
