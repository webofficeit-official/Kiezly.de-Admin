"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/lib/context/auth-context";
import NextTopLoader from "nextjs-toploader";
import NavigationProgress from "@/app/NavigationProgress";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/*  wrapper must be full-height flex column */}
         <div className="min-h-screen flex flex-col">
          <NextTopLoader color="#3f4040ff" showSpinner={false} />
          <NavigationProgress />
         
          {/*  main grows to push footer down */}
          <main className="flex-1">{children}</main>
       
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}
