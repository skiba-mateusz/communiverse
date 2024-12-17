import React from "react";
import styled, { css } from "styled-components";
import { Sidebar } from "./sidebar.tsx";
import { MobileNav } from "./mobile-nav.tsx";
import { Header } from "./header.tsx";

const Wrapper = styled.div`
  display: flex;
`;

const Main = styled.main`
  ${({ theme }) => css`
    flex: 1;
    height: calc(100vh - 4rem);
    padding-block: ${theme.spacing(4)};
    overflow-y: auto;
    scrollbar-width: thin;

    @media (max-width: ${theme.breakpoints.md}) {
      height: calc(100vh - 9rem);
    }
  `}
`;

interface AppLayoutProps extends React.PropsWithChildren {}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      <Header />
      <Wrapper>
        <Sidebar />
        <Main>{children}</Main>
      </Wrapper>
      <MobileNav />
    </>
  );
};
