
import { Outlet } from "react-router-dom";
import { AppLayout } from "@/components/layouts";

export const Root = () => {
    return (
        <AppLayout>
            <Outlet/>
        </AppLayout>
    )
}