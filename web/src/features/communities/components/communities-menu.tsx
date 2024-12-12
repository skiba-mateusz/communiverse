import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/link";
import { useRef, useState } from "react";
import {
  AiFillCaretDown,
  AiOutlineTeam,
  AiFillCaretUp,
  AiOutlineSearch,
} from "react-icons/ai";
import styled, { css } from "styled-components";
import { useCurrentUserCommunities } from "../api/get-current-user-communities";
import { Message } from "@/components/ui/message";
import { Loader } from "@/components/ui/loader";

const StyledCommunitiesMenu = styled.div`
  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.lg}) {
      display: none;
    }
  `}
`;

const MenuHeader = styled.header`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing(4)};

    & > button {
      aspect-ratio: 1/1;
      padding: ${theme.spacing(1)};

      & > svg {
        font-size: ${theme.font.size.sm};
      }
    }
  `}
`;

const MenuTitle = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
  `}
`;

const MenuList = styled.ul`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.neutral[300]};
    border-right: 0;
  `}
`;

export const CommunitiesMenu = () => {
  const { communities, isLoading, error } = useCurrentUserCommunities();
  const [isExpanded, setIsExpanded] = useState(true);

  if (error) {
    return <Message variant="alert">{error.message}</Message>;
  }

  return (
    <StyledCommunitiesMenu>
      <MenuHeader>
        <MenuTitle>
          <AiOutlineTeam />
          <span>Communities</span>
        </MenuTitle>
        <Button
          id="user-communities-btn"
          variant="soft"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-haspopup="menu"
          aria-label={
            isExpanded ? "Collapse communities menu" : "Expand communities menu"
          }
          aria-expanded={isExpanded}
        >
          {isExpanded ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </Button>
      </MenuHeader>
      {isExpanded ? (
        <MenuList
          id="user-communities"
          aria-label="List of user communities"
          role="menu"
        >
          <li role="presentation">
            <NavLink to="/app/communities" role="menuitem">
              <AiOutlineSearch />
              <span>Find Communities</span>
            </NavLink>
          </li>
          {isLoading ? (
            <Loader />
          ) : (
            communities?.map((community) => (
              <li role="presentation">
                <NavLink to="/app/communities/sample" role="menuitem">
                  <Avatar
                    size="small"
                    src={community.thumbnailURL || "/community.svg"}
                    name={community.name}
                  />
                </NavLink>
              </li>
            ))
          )}
        </MenuList>
      ) : null}
    </StyledCommunitiesMenu>
  );
};
