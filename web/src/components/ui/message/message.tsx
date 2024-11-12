import styled, { css } from "styled-components";

type Variant = "alert" | "status";

interface MessageProps extends React.PropsWithChildren {
  variant: Variant;
}

const variants = {
  alert: css`
    color: var(--clr-red-950);
    background-color: var(--clr-red-400);
  `,
  status: css`
    background-color: blue;
  `,
};

const StyledMessage = styled.p<MessageProps>`
  padding: var(--size-50) var(--size-100);
  ${({ variant }) => variants[variant]}
  border-radius: var(--size-100);
`;

export const Message = ({ variant = "status", children }: MessageProps) => {
  return <StyledMessage variant={variant}>{children}</StyledMessage>;
};
