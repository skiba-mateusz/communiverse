import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLogo = styled(Link)`
  color: var(--clr-neutral-950);
  font-size: var(--size-400);
  font-weight: 700;
  text-decoration: none;
`;

export const Logo = () => {
  return <StyledLogo to="/app">Communiverse</StyledLogo>;
};
