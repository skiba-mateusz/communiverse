import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineGlobal } from "react-icons/ai";

const StyledSidebar = styled.aside`
  ${({ theme }) => css`
    width: 16rem;
    height: calc(100vh - 4rem);
    border-right: 1px solid ${theme.colors.neutral[300]};

    @media (max-width: 70em) {
      width: 4rem;
    }

    @media (max-width: 50em) {
      display: none;
    }
  `}
`;

const Nav = styled.nav`
  ${({ theme }) => css`
    padding-block: ${theme.spacing(6)};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(4)};
  `}
`;

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => css`
    padding: ${theme.spacing(2)} ${theme.spacing(4)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    text-decoration: none;
    font-weight: ${theme.font.weight.medium};

    &.active,
    &:hover {
      background: ${theme.colors.neutral[200]};
    }

    @media (max-width: 70em) {
      & > span {
        display: none;
      }

      & > svg {
        margin-inline: auto;
      }
    }
  `}
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
