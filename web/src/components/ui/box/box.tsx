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

interface test {
  padding: string;
  borderRadius: string;
  width: string;
}

interface BoxProps extends React.PropsWithChildren {
  padding?: string;
  rounded?: string;
  width?: string;
  test?: test;
  as?: keyof JSX.IntrinsicElements;
}

export const Box = ({
  padding = "1rem",
  rounded = "0.5rem",
  test = { padding: "1rem", borderRadius: "2rem", width: "24rem" },
  as = "div",
  children,
}: BoxProps) => {
  return (
    <StyledBox as={as} test={test} padding={padding} rounded={rounded}>
      {children}
    </StyledBox>
  );
};
