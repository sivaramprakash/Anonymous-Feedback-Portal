"use client";

import BackButton from "@/components/auth/back-button";
import API from "@/services/API";
import React, { useEffect, useState } from "react";

export default function SubjectPage() {
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    faculty: "",
    batch: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [faculties, setFaculties] = useState([]);

  // Fetch batches for dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await API.get("/batch/getAllBatches");
        if (res.status === 200) setBatches(res.data);
      } catch (err) {
        console.error("Error fetching batches", err);
      }
    };
    const fetchFaculties = async () => {
      try {
        const res = await API.get("/faculty/getAllFaculty");
        if (res.status === 200) setFaculties(res.data);
      } catch (err) {
        console.error("Error fetching faculties", err);
      }
    };
    fetchFaculties();
    fetchBatches();
  }, []);

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get("/subject/getAllSubjects");
        if (res.status === 200) setSubjects(res.data);
      } catch (err) {
        console.error("Error fetching subjects", err);
      }
    };
    fetchSubjects();
  }, [submitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/subject/updateSubject/${editId}`, formData);
      } else {
        await API.post("/subject/createSubject", formData);
      }
      setFormData({ subjectName: "", subjectCode: "", faculty: "", batch: "" });
      setIsEditing(false);
      setEditId(null);
      setSubmitted((prev) => !prev);
    } catch (err) {
      console.error("Error submitting subject", err);
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      faculty: subject.faculty._id,
      batch: subject.batch,
    });
    setEditId(subject._id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/subject/deleteSubject/${id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting subject", err);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <BackButton userType={"admin"} />

      <h2 className="text-2xl font-bold text-center mb-6">Manage Subjects</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">Add / Edit Subject</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Subject Name
            </label>
            <input
              type="text"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Subject Code
            </label>
            <input
              type="text"
              name="subjectCode"
              value={formData.subjectCode}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Faculty
            </label>
            <select
              name="faculty"
              value={formData.faculty}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.username}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? "Update Subject" : "Add Subject"}
          </button>
        </form>

        {/* Table */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Existing Subjects</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Code
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Faculty
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Actions
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
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      {subject.faculty
                        ? `${subject.faculty.name} - ${subject.faculty.username}`
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      <button
                        onClick={() => handleEdit(subject)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subject._id)}
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
                    colSpan="5"
                    className="text-center py-4 text-sm text-gray-500"
                  >
                    No subjects available
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
