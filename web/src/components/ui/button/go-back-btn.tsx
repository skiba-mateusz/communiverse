import { useNavigate } from "react-router-dom";
import { AiOutlineLeft } from "react-icons/ai";
import styled, { css } from "styled-components";
import { getSize } from "./button";
import { Sizes, Styles } from "@/types/styles";
import { parseStyles } from "@/utils/styles";

interface GoBackBtnStyles {
  $size?: Sizes;
  $styles?: Styles;
}

interface GoBackBtnProps extends GoBackBtnStyles {}

const StyledGoBackBtn = styled.button<GoBackBtnStyles>`
  ${({ theme, $size = "medium", $styles }) => css`
    margin-bottom: ${theme.spacing(4)};
    padding-block: ${theme.spacing(2)};
    display: flex;

    gap: ${theme.spacing(2)};
    background: transparent;
    color: ${theme.colors.blue[500]};
    font-weight: ${theme.font.weight.semi};
    border: none;

    ${getSize(theme, $size)}

    & > * {
      transition: 300ms;
    }

    & > span {
      transition-delay: 100ms;
    }

    &:hover > * {
      transform: translateX(-25%);
    }

    ${parseStyles({ ...$styles }, theme)}
  `}
`;

export const GoBackBtn = ({
  $size = "medium",
  $styles,
  ...restProps
}: GoBackBtnProps) => {
  const navigate = useNavigate();

  return (
    <StyledGoBackBtn
      $styles={$styles}
      $size={$size}
      onClick={() => navigate(-1)}
      {...restProps}
    >
      <AiOutlineLeft /> <span>Back</span>
    </StyledGoBackBtn>
  );
};
