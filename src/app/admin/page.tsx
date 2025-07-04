"use client";

import LogoutButton from "@/components/auth/logout-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const colorForItem = (title) => {
    const colors = [
      "bg-blue-200",
      "bg-green-200",
      "bg-red-200",
      "bg-yellow-200",
      "bg-purple-200",
      "bg-pink-200",
    ];
    const colorMap = {
      forum: colors[0],
      faculty: colors[1],
      student: colors[2],
      subject: colors[3],
      batch: colors[4],
    };
    return colorMap[title.toLowerCase()] || colors[0];
  };
  const router = useRouter();
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (!storedAdmin) {
      router.push("/");
    }
    const adminData = JSON.parse(storedAdmin);
    if (!adminData || !adminData.username) {
      router.push("/");
    }
  }, []);

  const Card = ({ title }) => (
    <Link
      href={`/admin/${title}`}
      className={`${colorForItem(
        title
      )} cursor-pointer overflow-hidden relative transition-all duration-500 hover:translate-y-2 w-72 h-40 rounded-lg shadow-xl flex flex-row items-center justify-evenly gap-2 p-2 before:absolute before:w-full hover:before:top-0 before:duration-500 before:-top-1 before:h-1 `}
    >
      <div>
        <span className="font-bold text-2xl capitalize">{title}</span>
      </div>
    </Link>
  );

  return (
    <div className="container mx-auto p-6 relative">
      <LogoutButton userType="admin" />
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl m-16">
          <h1 className="text-4xl font-bold mb-8 text-center text-foreground">
            Admin Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="forum" />
            <Card title="faculty" />
            <Card title="student" />
            <Card title="subject" />
            <Card title="batch" />
          </div>
        </div>
      </div>
    </div>
  );
}
