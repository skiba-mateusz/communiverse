import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineGlobal, AiOutlineTeam } from "react-icons/ai";

const StyledMobileNav = styled.nav`
  position: fixed;
  inset: auto 0 0 0;
  height: 5rem;
  padding-inline: var(--size-300);
  display: none;
  border-top: 1px solid var(--clr-neutral-200);
  z-index: 1000;

  @media (max-width: 50em) {
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    gap: var(--size-300);
  }
`;

const MobileNavLink = styled(NavLink)`
  position: relative;
  max-width: 8rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 500;
  color: var(--clr-neutral-500);

  &.active {
    color: var(--clr-neutral-950);
  }

  &.active:before {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 2px;
    background: var(--clr-neutral-600);
  }

  & > svg {
    font-size: var(--fs-400);
  }
`;

export const MobileNav = () => {
  return (
    <StyledMobileNav>
      <MobileNavLink to="/app" end>
        <AiFillHome />
        Home
      </MobileNavLink>
      <MobileNavLink to="/app/posts" end>
        <AiOutlineGlobal />
        Explore
      </MobileNavLink>
      <MobileNavLink to="/app/communities" end>
        <AiOutlineTeam />
        Communities
      </MobileNavLink>
    </StyledMobileNav>
  );
};
