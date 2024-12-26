import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

type Variant = "alert" | "status";

interface MessageStyles {
  $variant: Variant;
  $styles?: Styles;
}

interface MessageProps extends React.PropsWithChildren, MessageStyles {
  as?: React.ElementType;
}

const variants = (theme: any, variant: Variant) => {
  switch (variant) {
    case "alert":
      return css`
        color: ${theme.colors.red[950]};
        background-color: ${theme.colors.red[400]};
      `;
    case "status":
      return css`
        background-color: ${theme.colors.blue[500]};
      `;
    default:
      throw new Error(`unknown variant: ${variant}`);
  }
};

const StyledMessage = styled.p<MessageProps>`
  ${({ theme, $variant, $styles }) => css`
    padding: ${theme.spacing(4)};
    border-radius: ${theme.border.radius.md};
    font-weight: ${theme.font.weight.semi};
    ${variants(theme, $variant)}
    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const Message = ({
  $variant = "status",
  $styles,
  as,
  children,
  ...restProps
}: MessageProps) => {
  return (
    <StyledMessage
      $variant={$variant}
      $styles={$styles}
      as={as}
      role={$variant}
      {...restProps}
    >
      {children}
    </StyledMessage>
  );
};
