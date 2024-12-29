import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GlobalStyle } from "@/styles/global-styles";
import { Toaster, ToastProvider } from "@/components/ui/toasts/index.ts";
import { ThemeProvider } from "@/contexts/theme-context";

interface AppProviderProps extends React.PropsWithChildren {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
});

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {import.meta.env.VITE_ENV != "production" && <ReactQueryDevtools />}
        <ThemeProvider>
          <GlobalStyle />
          <ToastProvider>
            <Toaster />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};
