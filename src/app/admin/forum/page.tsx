"use client";

import API from "@/services/API";
import React, { useEffect, useState } from "react";
import moment from "moment";
import BackButton from "@/components/auth/back-button";
import Link from "next/link";

export default function ForumPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    faculty: "",
    subject: "",
    batch: "",
  });

  type Faculty = { _id: string; name: string; username: string };
  type Subject = { _id: string; subjectName: string; subjectCode: string };
  type Batch = { _id: string; batchName: string };
  type Forum = {
    _id: string;
    title: string;
    description: string;
    faculty?: Faculty;
    subject?: Subject;
    batch?: Batch;
    messages?: any[];
    createdAt: string;
  };

  const [forums, setForums] = useState<Forum[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [forumRes, facultyRes, subjectRes, batchRes] = await Promise.all([
          API.get("/forum/getAllForums"),
          API.get("/faculty/getAllFaculty"),
          API.get("/subject/getAllSubjects"),
          API.get("/batch/getAllBatches"),
        ]);
        if (forumRes.status === 200) setForums(forumRes.data);
        if (facultyRes.status === 200) setFaculties(facultyRes.data);
        if (subjectRes.status === 200) setSubjects(subjectRes.data);
        if (batchRes.status === 200) setBatches(batchRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAll();
  }, [submitted]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  console.log("Forum", forums);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/forum/updateForum/${editId}`, formData);
      } else {
        await API.post("/forum/addForum", formData);
      }
      setFormData({
        title: "",
        description: "",
        faculty: "",
        subject: "",
        batch: "",
      });
      setIsEditing(false);
      setEditId(null);
      setSubmitted((prev) => !prev);
    } catch (err) {
      console.error("Error submitting forum", err);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await API.delete(`/forum/deleteForum/${id}`);
      setSubmitted((prev) => !prev);
    } catch (err) {
      console.error("Error deleting forum", err);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <BackButton userType={"admin"} />

      <h2 className="text-2xl font-bold text-center mb-6">Manage Forums</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Add / Edit Forum</h3>

          {["title", "description"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}

          {[
            { name: "faculty", options: faculties },
            { name: "subject", options: subjects },
            { name: "batch", options: batches },
          ].map(({ name, options }) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {name}
              </label>
              <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select {name}</option>
                {options.map((item) => (
                  <option key={item._id} value={item._id}>
                    {name === "faculty" && "name" in item && "username" in item
                      ? `${item.name} - ${item.username}`
                      : name === "subject" && "subjectName" in item && "subjectCode" in item
                      ? `${item.subjectName} - ${item.subjectCode}`
                      : name === "batch" && "batchName" in item
                      ? item.batchName
                      : `${name} not found`}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? "Update Forum" : "Create Forum"}
          </button>
        </form>

        {/* Table */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Existing Forums</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Title",
                  "Faculty",
                  "Subject",
                  "Batch",
                  "Messages",
                  "Created",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 border-b text-left text-sm text-gray-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forums.length > 0 ? (
                forums.map((forum) => (
                  <tr key={forum._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-xs text-nowrap underline text-primary hover:text-blue-600">
                      <Link href={`/admin/forum/${forum._id}`}>{forum.title}</Link>
                    </td>
                    <td className="px-4 py-2 border-b text-xs text-nowrap">
                      {`${forum.faculty?.name} - ${forum.faculty?.username}` ||
                        "-"}
                    </td>
                    <td className="px-4 py-2 border-b text-xs text-nowrap">
                      {forum.subject?.subjectName ||
                        forum.subject?.subjectCode ||
                        "Not Assigned"}
                    </td>
                    <td className="px-4 py-2 border-b text-xs">
                      {forum.batch?.batchName
                        ? forum.batch.batchName
                        : "Not Assigned"}
                    </td>
                    <td className="px-4 py-2 border-b text-xs text-nowrap">
                      {forum.messages?.length
                        ? `${forum.messages?.length} Messages`
                        : "No Messages"}
                    </td>
                    <td className="px-4 py-2 border-b text-xs text-nowrap">
                      {/* {new Date(forum.createdAt).toLocaleString()} */}
                      {moment(forum.createdAt).fromNow() !==
                        "a few seconds ago" &&
                        moment(forum.createdAt).fromNow()}
                      {moment(forum.createdAt).fromNow() ===
                        "a few seconds ago" &&
                        moment(forum.createdAt).format("MMM D, YYYY")}
                    </td>
                    <td className="px-1 py-2 border-b text-sm text-nowrap">
                      <button
                        onClick={() => handleDelete(forum._id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No forums available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
