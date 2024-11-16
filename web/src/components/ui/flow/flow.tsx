import React from "react";
import styled from "styled-components";

const StyledFlow = styled.div<FlowProps>`
  ${({ spacing }) => {
    return `
            & > * + * {
                margin-top: ${spacing};
            }
        `;
  }}
`;

interface FlowProps extends React.PropsWithChildren {
  spacing?: string;
}

export const Flow = ({ spacing = "2em", children }: FlowProps) => {
  return <StyledFlow spacing={spacing}>{children}</StyledFlow>;
};
