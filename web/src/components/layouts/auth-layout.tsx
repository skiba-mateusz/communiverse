import styled from "styled-components";
import { Head } from "@/components/seo";
import { Logo } from "@/components/ui/logo";
import { Flow } from "@/components/ui/flow";
import { Box } from "@/components/ui/box";
import { Heading } from "../ui/heading";
import { useLocation } from "react-router-dom";
import { Link } from "../ui/link";

const StyledAuthLayout = styled.div`
  padding: var(--size-400);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--size-600);
  height: 100vh;

  & > div {
    max-width: 28rem;
    width: 100%;
  }
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
  const location = useLocation();

  const authRoute = location.pathname.split("/")[2];

  return (
    <>
      <Head title={title} description={description} />
      <StyledAuthLayout>
        <Box padding="2rem">
          <Flow>
            <div>
              <Logo />
              <Heading as="h1">{title}</Heading>
            </div>
            {children}
          </Flow>
        </Box>
        {authRoute === "login" ? (
          <p>
            Do not have an account? <Link to="/auth/register">Register</Link>
          </p>
        ) : authRoute === "register" ? (
          <p>
            Already have an account? <Link to="/auth/login">Log In</Link>
          </p>
        ) : null}
      </StyledAuthLayout>
    </>
  );
};
