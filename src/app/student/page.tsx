"use client";
import LogoutButton from "@/components/auth/logout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import API from "@/services/API";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function StudentPage() {
  const [studentDetails, setStudentDetails] = React.useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("student");
      if (stored) {
        setStudentDetails(JSON.parse(stored));
        console.log("Student Details:", JSON.parse(stored));
      }
    }
  }, []);
  const [forums, setForums] = useState([]);
  useEffect(() => {
    const fetchForums = async () => {
      if (!studentDetails?.batch) return; // Prevent calling API with undefined
      try {
        const response = await API.get(
          `/forum/getForumPostsByStudent/${studentDetails.batch}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch forums");
        }
        setForums(response.data);
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };

    fetchForums();
  }, [studentDetails]);

  return (
    <div className="container mx-auto p-6 relative">
      <LogoutButton userType="student" />
      <h1 className="text-4xl font-bold mb-8 text-center text-foreground">
        Welcome {studentDetails?.username}
        <span className="italic font-serif font-light text-xl">
          {" "}
          {studentDetails?.anonymId}
        </span>
      </h1>

      <Card className="shadow-md size-full">
        <CardHeader>
          <CardTitle>Feedback Forums</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Faculty
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {forums.length > 0 ? (
                  forums.map((forum) => (
                    <tr
                      key={forum._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {forum?.title}
                        <br />
                        <span className="text-xs text-gray-500">
                          {forum?.description}
                        </span>
                      </th>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {forum?.subject?.subjectName}
                        <br />
                        <span className="text-xs text-gray-500">
                          {forum?.subject?.subjectCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {forum?.faculty?.name}
                        <br />
                        <span className="text-xs text-gray-500">
                          {forum?.faculty?.username}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/student/${forum._id}`}
                          className="text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No forums available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
