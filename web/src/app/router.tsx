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
          const { PostsRoute } = await import("./routes/app/posts");
          return { Component: PostsRoute };
        },
      },
      {
        path: "communities",
        lazy: async () => {
          const { CommunitiesRoute } = await import("./routes/app/communities");
          return { Component: CommunitiesRoute };
        },
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
