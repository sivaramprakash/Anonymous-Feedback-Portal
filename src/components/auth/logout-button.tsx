"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; // Correct icon import

export default function LogoutButton({ userType }: { userType: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear user session/local storage data
    await localStorage.removeItem(userType);
    await localStorage.removeItem(`${userType}Token`);
    await router.push("/");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="absolute top-4 left-4 text-muted-foreground hover:text-foreground" // Position top-left
      aria-label="Logout"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
