import React from "react";
import { Login } from "@/components/auth/login";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MainLayout } from "@/components/layout/main-layout";

export default function Home() {
  return (
    <SidebarProvider>
      <MainLayout>
        <Login />
      </MainLayout>
    </SidebarProvider>
  );
}
