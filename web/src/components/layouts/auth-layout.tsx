import styled, { css } from "styled-components";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/theme-context";
import { Head } from "@/components/seo";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/typography";
import { Link } from "@/components/ui/link";
import { GoBackBtn } from "@/components/ui/button";

const StyledAuthLayout = styled.main`
  ${({ theme }) => css`
    height: 100vh;
    padding: ${theme.spacing(4)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${theme.spacing(8)};
  `}
`;

interface AuthLayoutProps extends React.PropsWithChildren {
  title?: string;
  description?: string;
  canGoBack?: boolean;
}

export const AuthLayout = ({
  title = "",
  description = "",
  canGoBack = false,
  children,
}: AuthLayoutProps) => {
  const { theme } = useTheme();
  const location = useLocation();

  const authRoute = location.pathname.split("/")[2];

  return (
    <>
      <Head title={title} description={description} />
      <StyledAuthLayout>
        <img src={`/logo-${theme}.svg`} alt="Communiverse Logo" />
        <Box
          as="section"
          $styles={{
            padding: [6, 8, 10],
            maxWidth: "26rem",
            width: "100%",
          }}
        >
          {canGoBack ? <GoBackBtn /> : null}
          <Heading as="h1" $styles={{ textAlign: "center", marginBottom: 6 }}>
            {title}
          </Heading>
          {children}
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
