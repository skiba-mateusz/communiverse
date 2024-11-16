import React from "react";
import styled from "styled-components";
import { Size } from "@/types/styles";

const StyledBox = styled.div<BoxProps>`
  ${({ padding, rounded }) => {
    return `
      padding: ${padding};
      border: 1px solid var(--clr-neutral-200);
      border-radius: ${rounded}; 
    `;
  }}
`;

interface BoxProps extends React.PropsWithChildren {
  padding?: string;
  rounded?: string;
  width?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Box = ({
  padding = "1rem",
  rounded = "0.5rem",
  as = "div",
  children,
}: BoxProps) => {
  return (
    <StyledBox as={as} padding={padding} rounded={rounded}>
      {children}
    </StyledBox>
  );
};
