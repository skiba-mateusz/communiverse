import { useState } from "react";
import styled, { css } from "styled-components";
import { AiFillCaretDown, AiOutlineTeam, AiFillCaretUp } from "react-icons/ai";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/link";
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
  position: relative;
  display: flex;
  align-items: center;

  & > a {
    flex: 1;
  }

  & > button {
    top: 0;
    right: 0;
    position: absolute;
  }
`;

const MenuTitle = styled(NavLink)`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
  `}
`;

export const CommunitiesMenu = () => {
  const { communities, isLoading, error } = useCurrentUserCommunities();
  const [isExpanded, setIsExpanded] = useState(true);

  if (error) {
    return (
      <Message $variant="alert">
        There was an error trying to display your communities
      </Message>
    );
  }

  return (
    <StyledCommunitiesMenu>
      <MenuHeader>
        <MenuTitle to="/app/communities" end>
          <AiOutlineTeam />
          <span>Communities</span>
        </MenuTitle>
        <Button
          $size="icon"
          $variant="transparent"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-haspopup="menu"
          aria-label={
            isExpanded ? "Collapse communities menu" : "Expand communities menu"
          }
          aria-expanded={isExpanded}
          aria-controls="user-communities"
        >
          {isExpanded ? <AiFillCaretUp /> : <AiFillCaretDown />}
        </Button>
      </MenuHeader>
      {isExpanded ? (
        <ul
          id="user-communities"
          aria-label="List of user communities"
          role="menu"
        >
          {isLoading ? (
            <Loader />
          ) : (
            communities?.map(({ name, slug, thumbnailURL }) => (
              <li role="presentation" key={slug}>
                <NavLink to={`/app/communities/${slug}`} role="menuitem">
                  <Avatar>
                    <AvatarImage
                      src={thumbnailURL}
                      fallback={name}
                      alt={`${name}'s avatar`}
                    />
                  </Avatar>
                  {name}
                </NavLink>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </StyledCommunitiesMenu>
  );
};
