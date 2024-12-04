import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";
import styled, { css } from "styled-components";

type Variant = "alert" | "status";

interface MessageProps extends React.PropsWithChildren {
  variant: Variant;
  styles?: Styles;
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
        background-color: blue;
      `;
    default:
      throw new Error(`unknown variant: ${variant}`);
  }
};

const StyledMessage = styled.p<MessageProps>`
  ${({ theme, variant, styles }) => css`
    padding: var(--size-50) var(--size-100);
    border-radius: var(--size-100);
    ${variants(theme, variant)}
    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const Message = ({ variant = "status", children }: MessageProps) => {
  return (
    <StyledMessage role={variant} variant={variant}>
      {children}
    </StyledMessage>
  );
};
