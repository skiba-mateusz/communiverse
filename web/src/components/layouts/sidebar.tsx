import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineGlobal } from "react-icons/ai";

const StyledSidebar = styled.aside`
  width: 16rem;
  height: calc(100vh - 4rem);
  border-right: 1px solid var(--clr-neutral-200);

  @media (max-width: 70em) {
    width: 4rem;
  }

  @media (max-width: 50em) {
    display: none;
  }
`;

const Nav = styled.nav`
  padding-block: var(--size-600);
  display: flex;
  flex-direction: column;
  gap: var(--size-400);
`;

const StyledNavLink = styled(NavLink)`
  padding: var(--size-100) var(--size-300);
  display: flex;
  align-items: center;
  gap: var(--size-200);
  text-decoration: none;
  font-weight: 500;

  &.active,
  &:hover {
    background: var(--clr-neutral-100);
  }

  @media (max-width: 70em) {
    & > span {
      display: none;
    }

    & > svg {
      margin-inline: auto;
      font-size: var(--fs-200);
    }
  }
`;

export const Sidebar = () => {
  return (
    <StyledSidebar>
      <Nav>
        <ul>
          <li>
            <StyledNavLink to="/app" end>
              <AiFillHome />
              <span>Home</span>
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink to="/app/posts" end>
              <AiOutlineGlobal />
              <span>Explore</span>
            </StyledNavLink>
          </li>
        </ul>
      </Nav>
    </StyledSidebar>
  );
};
