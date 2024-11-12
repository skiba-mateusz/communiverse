import styled from "styled-components";
import { Head } from "@/components/seo";
import { Logo } from "@/components/ui/logo";
import { Flow } from "@/components/ui/flow";
import { Box } from "@/components/ui/box";
import { Heading } from "../ui/heading";

const StyledAuthLayout = styled.div`
  padding: var(--size-400);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

interface AuthLayoutProps extends React.PropsWithChildren {
  title?: string;
  description?: string;
}

export const AuthLayout = ({
  title = "",
  description = "",
  children,
}: AuthLayoutProps) => {
  return (
    <>
      <Head title={title} description={description} />
      <StyledAuthLayout>
        <Box padding={600}>
          <Flow>
            <div>
              <Logo />
              <Heading as="h1">{title}</Heading>
            </div>
            {children}
          </Flow>
        </Box>
      </StyledAuthLayout>
    </>
  );
};
