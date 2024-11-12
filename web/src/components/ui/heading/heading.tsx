import React from "react";
import styled, { css } from "styled-components";

const levels: Record<string, any> = {
  h1: css`
    font-size: var(--fs-h1);
  `,
  h2: css`
    font-size: var(--fs-h2);
  `,
  h3: css`
    font-size: var(--fs-h3);
  `,
  h4: css`
    font-size: var(--fs-h4);
  `,
  h5: css`
    font-size: var(--fs-h5);
  `,
  h6: css`
    font-size: var(--fs-h6);
  `,
};

const StyledHeading = styled.h1<HeadingProps>`
  position: relative;
  padding-bottom: 0.15em;
  color: var(--clr-neutral-950);
  ${({ as }) => levels[as] || levels.h1}

  &::before,
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0.15em;
    display: block;
    border-radius: var(--size-50);
  }

  &::before {
    width: 25%;
    background-color: var(--clr-neutral-600);
    z-index: 2;
  }

  &::after {
    background-color: var(--clr-neutral-400);
  }

  @media (max-width: 50em) {
    display: block;
  }
`;

interface HeadingProps extends React.PropsWithChildren {
  as: keyof typeof levels;
}

export const Heading = ({ as, children }: HeadingProps) => {
  return <StyledHeading as={as}>{children}</StyledHeading>;
};
