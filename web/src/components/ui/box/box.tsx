import React from "react";
import styled from "styled-components";
import { Size } from "@/types/styles";

const StyledBox = styled.div<BoxProps>`
  ${({ padding, rounded }) => {
    return `
      padding: var(--size-${padding});
      border: 1px solid var(--clr-neutral-200);
      border-radius: var(--size-${rounded}); 
    `;
  }}
`;

interface BoxProps extends React.PropsWithChildren {
  padding?: Size;
  rounded?: Size;
  as?: keyof JSX.IntrinsicElements;
}

export const Box = ({
  padding = 400,
  rounded = 100,
  as = "div",
  children,
}: BoxProps) => {
  return (
    <StyledBox as={as} padding={padding} rounded={rounded}>
      {children}
    </StyledBox>
  );
};
