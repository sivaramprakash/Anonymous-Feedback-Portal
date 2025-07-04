"use client";
import API from "@/services/API";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AdminRegister() {
  const [form, setform] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setform((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await API.post("/admin/register", form);
      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        // Redirect to login page or show success message
        router.push("/");
      } else {
        console.error("Registration failed:", response.statusText);
        setError(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "message" in (error as any).response.data
      ) {
        setError(
          ((error as any).response.data.message as string) ||
            "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Admin Register</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Username:
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password:
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-md"
          >
            Register
          </button>
          <p className="text-sm text-gray-500 mt-2 flex gap-2 items-center text-center">
            <span>Already have an account?</span>
            <Link href={"/"} className="text-primary hover:underline">
              Login here
            </Link>
          </p>
          {/* Error message */}
          {error ? <p className="text-red-500 text-sm mt-2">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
