"use client";

import BackButton from "@/components/auth/back-button";
import API from "@/services/API";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function FacultyPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  type Faculty = {
    _id: string;
    username: string;
    name: string;
    password?: string;
    handlingSubjects?: string[];
    batches?: string[];
  };

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch faculty on mount and on submit
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await API.get("/faculty/getAllFaculty");
        if (res.status === 200) setFaculties(res.data);
      } catch (err) {
        console.error("Error fetching faculties", err);
      }
    };
    fetchFaculties();
  }, [submitted]);

  const router = useRouter();
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const faculty = localStorage.getItem("faculty");
    if (userType !== "faculty" && faculty) {
      router.replace("/");
    }
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/faculty/updateFaculty/${editId}`, formData);
      } else {
        await API.post("/faculty/addFaculty", formData);
      }
      setFormData({
        username: "",
        password: "",
        name: "",
      });
      setIsEditing(false);
      setEditId(null);
      setSubmitted((prev) => !prev);
    } catch (err) {
      console.error("Error submitting faculty", err);
    }
  };

  const handleEdit = (faculty: any) => {
    setFormData({
      username: faculty.username,
      password: "",
      name: faculty.name,
    });
    setIsEditing(true);
    setEditId(faculty._id);
  };

  const handleDelete = async (id: any) => {
    try {
      await API.delete(`/faculty/deleteFaculty/${id}`);
      setFaculties((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error deleting faculty", err);
    }
  };
  const showPassword = (faculty: Faculty) => {
    alert(`Password for ${faculty.username}: ${faculty.password ?? "N/A"}`);
  };
  return (
    <div className="container mx-auto p-6">
      <BackButton userType={"admin"} />
      <h2 className="text-2xl font-bold text-center mb-6">Manage Faculties</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Add / Edit Faculty</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEditing} // required only when adding
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? "Update Faculty" : "Add Faculty"}
          </button>
        </form>

        {/* Table */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Existing Faculties</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Username
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Handling Subjects
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Batches
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {faculties.length > 0 ? (
                faculties.map((faculty) => (
                  <tr key={faculty._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-sm text-gray-700 cursor-pointer">
                      {faculty.name}
                    </td>
                    <td
                      onClick={() => showPassword(faculty)}
                      className="px-4 py-2 border-b text-sm text-gray-700 cursor-pointer"
                    >
                      {faculty.username}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      {(faculty.handlingSubjects || []).join(", ")}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      {(faculty.batches || []).join(", ")}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      <button
                        onClick={() => handleEdit(faculty)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faculty._id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No faculties available
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
