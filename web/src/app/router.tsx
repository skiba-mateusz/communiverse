import {  RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
    [
        {
            path: "/",
            lazy: async () => {
                const { HomeRoute } = await import("./routes/home");
                return { Component: HomeRoute };
            }
        },
    ]
)

export const AppRouter = () => {
    return <RouterProvider router={router} />
}