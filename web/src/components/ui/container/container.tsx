import React from "react";
import styled, { css } from "styled-components";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface ContainerProps extends React.PropsWithChildren {
  styles?: Styles;
  variant?: "full" | "narrow";
}

const variants = {
  full: css`
    width: calc(100% - 2rem);
  `,
  narrow: css`
    width: min(42rem, calc(100% - 2rem));
  `,
};

export const Container = styled.div<ContainerProps>`
  ${({ theme, variant, styles }) => css`
    ${variants[variant || "full"]};
    margin-inline: auto;
    ${parseStyles({ ...styles }, theme)}
  `}
`;

Container.displayName = "Container";
