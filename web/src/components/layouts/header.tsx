import styled, { css } from "styled-components";
import { Container } from "../ui/container";
import { Logo } from "../ui/logo/logo.tsx";
import { Button } from "../ui/button/button.tsx";
import { Avatar } from "../ui/avatar/avatar.tsx";
import { useCurrentUser } from "@/features/users/api/get-current-user.ts";
import { AvatarImage } from "../ui/avatar/avatar-image.tsx";

const StyledHeader = styled.header`
  ${({ theme }) => css`
    height: 4rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${theme.colors.neutral[300]};

    & > div {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `}
`;

export const Header = () => {
  const { user } = useCurrentUser();

  if (!user) return null;

  const { username, avatarURL } = user;

  return (
    <StyledHeader>
      <Container>
        <Logo />
        <Button $variant="transparent">
          <Avatar>
            <AvatarImage
              src={avatarURL}
              fallback={username}
              alt={`${username}'s avatar`}
            />
          </Avatar>
        </Button>
      </Container>
    </StyledHeader>
  );
};
