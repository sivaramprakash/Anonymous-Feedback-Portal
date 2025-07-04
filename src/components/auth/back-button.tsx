"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ userType }: { userType: string }) {
  const router = useRouter();

  const handleBack = () => {
    router.push(`/${userType}`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleBack}
      className="absolute top-4 left-4 text-muted-foreground hover:text-foreground" // Position top-left
      aria-label="Logout"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
}
