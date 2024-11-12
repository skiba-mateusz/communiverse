import React from "react";
import styled from "styled-components";
import { Sidebar } from "./sidebar.tsx";
import { MobileNav } from "./mobile-nav.tsx";
import { Header } from "./header.tsx";

const Wrapper = styled.div`
  display: flex;
`;

const Main = styled.main`
  flex: 1;
  height: calc(100vh - 4rem);
  overflow-y: auto;
  scrollbar-width: thin;
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
