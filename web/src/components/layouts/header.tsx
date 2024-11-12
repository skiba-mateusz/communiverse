import styled from "styled-components";
import { Container } from "../ui/container";
import { Logo } from "../ui/logo/logo.tsx";

const StyledHeader = styled.header`
  height: 4rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--clr-neutral-200);

  & > div {
    height: 100%;
  }
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
