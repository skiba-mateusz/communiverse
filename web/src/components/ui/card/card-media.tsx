import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  styles?: Styles;
}

const Wrapper = styled.div<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    padding: 1rem;

    img {
      border-radius: ${theme.border.radius.md};
      width: 100%;
      height: 100%;
      aspect-ratio: 16/9;
      transition: 300ms;
    }

    @media (max-width: ${theme.breakpoints.md}) {
      padding: 0;
      img {
        aspect-ratio: 1/1;
      }
    }

    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const CardMedia = ({ styles, ...restProps }: CardMediaProps) => {
  return (
    <Wrapper styles={styles}>
      <img {...restProps} />
    </Wrapper>
  );
};
