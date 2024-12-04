import styled, { css } from "styled-components";
import { Container } from "../ui/container";
import { Logo } from "../ui/logo/logo.tsx";

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
  return (
    <StyledHeader>
      <Container>
        <Logo />
        <div>User Menu</div>
      </Container>
    </StyledHeader>
  );
};
