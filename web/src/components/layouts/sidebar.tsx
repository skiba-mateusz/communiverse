import styled, { css } from "styled-components";
import { AiFillHome, AiOutlineGlobal, AiOutlineTeam } from "react-icons/ai";
import { CommunitiesMenu } from "@/features/communities/components/communities-menu";
import { NavLink } from "../ui/link";

const StyledSidebar = styled.aside`
  ${({ theme }) => css`
    width: 16rem;
    height: calc(100vh - 4rem);
    border-right: 1px solid ${theme.colors.neutral[300]};

    @media (max-width: ${theme.breakpoints.lg}) {
      width: 4rem;
    }

    @media (max-width: ${theme.breakpoints.md}) {
      display: none;
    }
  `}
`;

const Nav = styled.nav`
  ${({ theme }) => css`
    padding-block: ${theme.spacing(6)};
    display: flex;
    flex-direction: column;

    @media (min-width: ${theme.breakpoints.lg}) {
      & > ul > li:nth-of-type(3) {
        display: none;
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
            <NavLink to="/app" end>
              <AiFillHome />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/posts" end>
              <AiOutlineGlobal />
              <span>Explore</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/app/communities" end>
              <AiOutlineTeam />
              <span>Communities</span>
            </NavLink>
          </li>
          <li>
            <CommunitiesMenu />
          </li>
        </ul>
      </Nav>
    </StyledSidebar>
  );
};
