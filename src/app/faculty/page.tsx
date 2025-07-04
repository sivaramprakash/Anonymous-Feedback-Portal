"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoutButton from "@/components/auth/logout-button"; // Import LogoutButton
import API from "@/services/API";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [facultyDetails, setFacultyDetails] = useState({});
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const faculty = localStorage.getItem("faculty");
    if (userType === "faculty") {
      const facultyData = JSON.parse(faculty || "{}");
      setFacultyDetails(facultyData);
    }
    if (userType !== "faculty" && faculty) {
      router.replace("/");
    }
  }, [facultyDetails, router]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [forums, setForums] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await API.get(
          `/subject/getSubjectsByfacultyId/${facultyDetails?.id}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch subjects");
        }
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    const fetchBatches = async () => {
      try {
        const response = await API.get(
          `/batch/getBatchByFaculty/${facultyDetails?.id}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch batches");
        }
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    const fetchForums = async () => {
      try {
        const response = await API.get(
          `/forum/getForumsByFaculty/${facultyDetails?.id}`
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch forums");
        }
        console.log("Fetched forums:", response.data);

        setForums(response.data);
      } catch (error) {
        console.error("Error fetching forums:", error);
      }
    };
    fetchForums();
    fetchBatches();
    fetchSubjects();
  }, [facultyDetails?.id, router]);

  const findSubjectName = useCallback(
    (subjectId) => {
      const subject = subjects.find((sub) => sub._id === subjectId);
      return subject ? subject.subjectName : "Unknown Subject";
    },
    [subjects]
  );

  return (
    <div className="container mx-auto p-6 relative">
      <LogoutButton userType="faculty" />
      <h1 className="text-4xl font-bold mb-8 text-center text-foreground">
        Welcome {facultyDetails?.name || "Faculty"}
        <span className="italic"> ({facultyDetails?.username}) </span>!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 grid-flow-col">
        <div className="col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Card className="shadow-md size-full">
              <CardHeader>
                <CardTitle>Subjects Undertaken</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                        Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <tr key={subject._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b text-sm text-gray-700">
                            {subject.subjectName}
                          </td>
                          <td className="px-4 py-2 border-b text-sm text-gray-700">
                            {subject.subjectCode}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-4 text-sm text-gray-500"
                        >
                          No subjects available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-2">
            <Card className="shadow-md size-full">
              <CardHeader>
                <CardTitle>Assigned Batches</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                        Batch Name
                      </th>
                      <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                        Duration
                      </th>
                      <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                        Subjects
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Example row (replace with real batch data) */}
                    {batches.length > 0 ? (
                      batches.map((batch) => (
                        <tr key={batch._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b text-sm text-gray-700">
                            {batch.batchName}
                          </td>
                          <td className="px-4 py-2 border-b text-sm text-gray-700">
                            {batch.batchDuration}
                          </td>
                          <td className="px-4 py-2 border-b text-sm text-gray-700">
                            {batch.subjects.length > 0 ? (
                              batch.subjects.map((subjectId) => (
                                <span
                                  key={subjectId}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {findSubjectName(subjectId)}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500">No subjects</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-gray-50">
                        <td
                          colSpan="4"
                          className="px-4 py-2 border-b text-sm text-gray-700 text-center"
                        >
                          No batches available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="col-span-6">
          <Card className="shadow-md size-full">
            <CardHeader>
              <CardTitle>Feedback Forums</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              {/* Table with columns - title, subject, batch, action (open)*/}
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                      Title
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                      Subject
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                      Batch
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {forums.length > 0 ? (
                    forums.map((forum) => (
                      <tr key={forum._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b text-sm text-gray-700">
                          {forum?.title}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">
                          {findSubjectName(forum?.subject?._id)}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">
                          {forum?.batch?.batchName || "-"}
                        </td>
                        <td className="px-4 py-2 border-b text-sm text-gray-700">
                          <Link
                            href={`/faculty/${forum?._id}`}
                            prefetch={false}
                            className="px-4 block mx-auto rounded-md py-2 border-b text-sm text-center bg-purple-100 text-purple-600 hover:underline cursor-pointer"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-4 text-sm text-gray-500"
                      >
                        No forums available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
