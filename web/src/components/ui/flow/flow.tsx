import React from "react";
import styled from "styled-components";
import { Size } from "@/types/styles";

const StyledFlow = styled.div<FlowProps>`
  ${({ size }) => {
    return `
            & > * + * {
                margin-top: var(--size-${size});
            }
        `;
  }}
`;

interface FlowProps extends React.PropsWithChildren {
  size?: Size;
}

export const Flow = ({ size = 300, children }: FlowProps) => {
  return <StyledFlow size={size}>{children}</StyledFlow>;
};
