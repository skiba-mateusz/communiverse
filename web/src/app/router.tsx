import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Root } from "./routes/app/root.tsx";
import { ProtectedRoute } from "./routes/app/protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" />, // TODO: replace with landing page
  },
  {
    path: "/auth/login",
    lazy: async () => {
      const { LoginRoute } = await import("./routes/auth/login");
      return { Component: LoginRoute };
    },
  },
  {
    path: "/auth/register",
    lazy: async () => {
      const { RegisterRoute } = await import("./routes/auth/register");
      return { Component: RegisterRoute };
    },
  },
  {
    path: "/auth/confirm/:confirmationToken",
    lazy: async () => {
      const { ConfirmRoute } = await import("./routes/auth/confirm.tsx");
      return { Component: ConfirmRoute };
    },
  },
  {
    path: "/auth/forgot-password",
    lazy: async () => {
      const { ForgotPasswordRoute } = await import(
        "./routes/auth/forgot-password"
      );
      return { Component: ForgotPasswordRoute };
    },
  },
  {
    path: "/auth/reset-password/:resetToken",
    lazy: async () => {
      const { ResetPasswordRoute } = await import(
        "./routes/auth/reset-password"
      );
      return { Component: ResetPasswordRoute };
    },
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        lazy: async () => {
          const { HomeRoute } = await import("./routes/app/home");
          return { Component: HomeRoute };
        },
      },
      {
        path: "posts",
        lazy: async () => {
          const { PostsRoute } = await import("./routes/app/posts/posts.tsx");
          return { Component: PostsRoute };
        },
      },
      {
        path: "communities",
        lazy: async () => {
          const { CommunitiesRoute } = await import(
            "./routes/app/communities/communities.tsx"
          );
          return { Component: CommunitiesRoute };
        },
      },
      {
        path: "communities/:communitySlug",
        lazy: async () => {
          const { CommunityRoute } = await import(
            "./routes/app/communities/community.tsx"
          );
          return { Component: CommunityRoute };
        },
      },
      {
        path: "communities/:communitySlug/create",
        lazy: async () => {
          const { CreateRoute } = await import(
            "./routes/app/communities/create.tsx"
          );
          return { Component: CreateRoute };
        },
      },
      {
        path: "communities/:communitySlug/posts/:postSlug",
        lazy: async () => {
          const { PostRoute } = await import("./routes/app/posts/post.tsx");
          return { Component: PostRoute };
        },
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
