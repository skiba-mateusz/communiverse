import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineGlobal, AiOutlineTeam } from "react-icons/ai";

const StyledMobileNav = styled.nav`
  ${({ theme }) => css`
    position: fixed;
    inset: auto 0 0 0;
    height: 5rem;
    padding-inline: ${theme.spacing(4)};
    display: none;
    background-color: ${theme.colors.neutral[50]};
    border-top: 1px solid ${theme.colors.neutral[200]};
    z-index: 1000;

    @media (max-width: 50em) {
      display: flex;
      align-items: stretch;
      justify-content: space-around;
      gap: ${theme.spacing(3)};
    }
  `}
`;

const MobileNavLink = styled(NavLink)`
  ${({ theme }) => css`
    position: relative;
    max-width: 8rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-weight: ${theme.font.weight.medium};
    color: ${theme.colors.neutral[500]};

    &.active {
      color: ${theme.colors.neutral[900]};
    }

    &.active:before {
      content: "";
      position: absolute;
      top: 0;
      width: 100%;
      height: 2px;
      background: ${theme.colors.neutral[600]};
    }

    & > svg {
      font-size: ${theme.font.size.xxl};
    }
  `}
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
