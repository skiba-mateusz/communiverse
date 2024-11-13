import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalStyle } from "../styles/global-styles.ts";
import * as React from "react";
import { Toaster, ToastProvider } from "@/components/ui/toasts/index.ts";
import { IconContext } from "react-icons";

interface AppProviderProps extends React.PropsWithChildren {}

const queryClient = new QueryClient();

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        {import.meta.env.VITE_ENV != "production" && <ReactQueryDevtools />}
        <IconContext.Provider value={{ size: "1.5em" }}>
          <ToastProvider>
            <Toaster />
            {children}
          </ToastProvider>
        </IconContext.Provider>
      </QueryClientProvider>
    </>
  );
};
