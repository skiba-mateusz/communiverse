import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/theme-context";

const StyledLogo = styled(Link)`
  ${({ theme }) => css`
    color: ${theme.colors.neutral[950]};
    font-size: ${theme.font.size.md};
    font-weight: ${theme.font.weight.bold};
    text-decoration: none;
  `}
`;

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <StyledLogo to="/app">
      <img src={`/logo-${theme}.svg`} alt="Communiverse Logo" />
    </StyledLogo>
  );
};
