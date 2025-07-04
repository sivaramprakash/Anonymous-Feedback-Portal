"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API, { setAuthToken } from "@/services/API";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userType: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ api?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitCallback = (data: any) => {
    setAuthToken(data.token, data.userType);
    localStorage.setItem(`${formData.userType}Token`, data.token);
    localStorage.setItem(
      formData.userType,
      JSON.stringify(data[formData.userType])
    );
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    console.log("Login success:", data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userType || !formData.username || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await API.post(`${formData.userType}/login`, formData);
      submitCallback(response.data);

      setTimeout(() => {
        switch (formData.userType) {
          case "student":
            router.replace("/student");
            break;
          case "faculty":
            router.replace("/faculty");
            break;
          case "admin":
            router.replace("/admin");
            break;
          default:
            alert("Invalid user type");
        }
      }, 1000);
    } catch (error: any) {
      console.error(error);
      setErrors({ api: error.response?.data?.message || "Server error" });
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem(`${formData.userType}Token`);
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const user = localStorage.getItem(formData.userType);
    if (user) {
      const parsedUser = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        username: parsedUser.username || "",
        password: parsedUser.password || "",
      }));
    }
    if (user) {
      switch (formData.userType) {
        case "student":
          localStorage.setItem("userType", "student");
          router.replace("/student");
          break;
        case "faculty":
          localStorage.setItem("userType", "faculty");
          router.replace("/faculty");
          break;
        case "admin":
          localStorage.setItem("userType", "admin");
          router.replace("/admin");
          break;
        default:
          alert("Invalid user type");
      }
    }
  }, [formData.userType]);

  // If the OTP === 21679 redirect to /admin/auth/register
  const [otp, setOtp] = useState("");
  const handleLock = (e: React.MouseEvent) => {
    e.preventDefault();
    if (otp === "21679") {
      router.push("/admin/auth/register");
    } else {
      alert("Incorrect Password");
    }
  };
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <Card className="w-96 shadow-lg rounded-lg">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center mb-4">
              <CardTitle className="text-xl font-bold">
                Feedback forum
              </CardTitle>
            </div>
            <CardDescription>
              Choose user type and enter credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="userType">User Type</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, userType: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />

                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />

                {errors.api && (
                  <p className="text-red-500 text-sm">{errors.api}</p>
                )}

                <button
                  type="submit"
                  title={
                    !formData.userType ||
                    !formData.username ||
                    !formData.password
                      ? "Please fill all fields"
                      : "Login"
                  }
                  className="w-full mt-4 disabled:cursor-not-allowed disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={
                    !formData.userType ||
                    !formData.username ||
                    !formData.password ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <Dialog>
              <DialogTrigger>
                <span className="text-primary font-bold cursor-pointer">
                  Create an Admin
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center flex gap-2 flex-col items-center">
                  <DialogTitle>Enter the Password</DialogTitle>
                    <div className="flex justify-center items-center my-16">
                    <InputOTP
                      className="border-2 border-gray-300 rounded-md p-2 flex items-center justify-center"
                      maxLength={5}
                      onChange={(value) => {
                      handleOtpChange(value);
                      if (value === "21679") {
                        router.push("/admin/auth/register");
                      }
                      }}
                      value={otp}
                    >
                      <InputOTPGroup className="flex items-center justify-center gap-2">
                      <InputOTPSlot
                        className="border-2 border-gray-300 rounded-md p-2"
                        index={0}
                      />
                      <InputOTPSlot
                        className="border-2 border-gray-300 rounded-md p-2"
                        index={1}
                      />
                      <InputOTPSlot
                        className="border-2 border-gray-300 rounded-md p-2"
                        index={2}
                      />
                      <InputOTPSlot
                        className="border-2 border-gray-300 rounded-md p-2"
                        index={3}
                      />
                      <InputOTPSlot
                        className="border-2 border-gray-300 rounded-md p-2"
                        index={4}
                      />
                      </InputOTPGroup>
                    </InputOTP>
                    </div>
                    {/* Submit button */}
                    <button
                    type="button"
                    className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={handleLock}
                    disabled={otp.length !== 5}
                    >
                    {otp === "21679" ? "Redirecting..." : "Create Admin"}
                    </button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
