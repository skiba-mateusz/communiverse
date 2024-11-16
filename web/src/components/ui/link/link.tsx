import styled from "styled-components";
import { Link as RouterLink, LinkProps } from "react-router-dom";

const StyledLink = styled(RouterLink)`
  color: var(--clr-blue-500);
  font: inherit;
`;

export const Link = ({ to, children }: LinkProps) => {
  return <StyledLink to={to}>{children}</StyledLink>;
};
