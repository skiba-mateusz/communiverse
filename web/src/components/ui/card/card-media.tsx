import React from "react";
import styled, { css } from "styled-components";
import { Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface CardMediaProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  styles?: Styles;
}

const StyledCardMedia = styled.img<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    ${parseStyles({ ...styles }, theme)}
  `}
`;

export const CardMedia = ({ styles, ...restProps }: CardMediaProps) => {
  return <StyledCardMedia styles={styles} {...restProps}></StyledCardMedia>;
};
