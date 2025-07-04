"use client";

import BackButton from "@/components/auth/back-button";
import API from "@/services/API";
import React, { useEffect, useState } from "react";

export default function StudentPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    batch: "", // added batch here
  });

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchRes = await API.get("/batch/getAllBatches");
        const studentRes = await API.get("/student/getAllStudents");

        if (batchRes.status === 200) setBatches(batchRes.data);
        if (studentRes.status === 200) setStudents(studentRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, [submitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/student/updateStudent/${editId}`, formData);
      } else {
        await API.post("/student/addStudent", formData);
      }

      setFormData({ username: "", password: "", batch: "" });
      setIsEditing(false);
      setEditId(null);
      setSubmitted((prev) => !prev);
    } catch (err) {
      console.error("Error submitting student", err);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      username: student.username,
      password: "", // don't prefill password for security
      batch: student.batch || "",
    });
    setIsEditing(true);
    setEditId(student._id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/student/deleteStudent/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting student", err);
    }
  };
  const showPassword = (student) => {
    alert(`Password for ${student.username}: ${student.password}`);
  };
  return (
    <div className="container mx-auto p-6">
      <BackButton userType={"admin"} />

      <h2 className="text-2xl font-bold text-center mb-6">Manage Students</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Student" : "Add Student"}
          </h3>

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
              Batch
            </label>
            <select
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select Batch
              </option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? "Update Student" : "Add Student"}
          </button>
        </form>

        {/* Table */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">All Students</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="cursor-pointer px-4 py-2 border-b text-left text-sm text-gray-700">
                  Username
                </th>
                <th className="cursor-pointer px-4 py-2 border-b text-left text-sm text-gray-700">
                  Anonym ID
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Batch
                </th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td
                      onClick={() => showPassword(student)}
                      className="px-4 py-2 border-b text-sm text-gray-700"
                    >
                      {student.username}
                    </td>
                    <td
                      onClick={() => showPassword(student)}
                      className="px-4 py-2 border-b text-sm text-gray-700"
                    >
                      {student.anonymId || "-"}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      {student.batch.batchName || "Not Assigned"}
                    </td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
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
                    colSpan="4"
                    className="px-4 py-2 border-b text-sm text-gray-700 text-center"
                  >
                    No students found
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
