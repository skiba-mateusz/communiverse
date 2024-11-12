import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalStyle } from "../styles/global-styles.ts";
import * as React from "react";
import { Toaster, ToastProvider } from "@/components/ui/toasts/index.ts";

interface AppProviderProps extends React.PropsWithChildren {}

const queryClient = new QueryClient();

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        {import.meta.env.VITE_ENV != "production" && <ReactQueryDevtools />}
        <ToastProvider>
          <Toaster />
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </>
  );
};
