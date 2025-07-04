"use client";

import BackButton from "@/components/auth/back-button";
import API from "@/services/API";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Subject {
  _id: string;
  subjectName: string;
}

interface Batch {
  _id?: string;
  batchName: string;
  batchDuration: string;
  subjects: string[];
}

export default function BatchComponent() {
  const [formData, setFormData] = useState<Batch>({
    batchName: "",
    batchDuration: "",
    subjects: [],
  });

  const [batches, setBatches] = useState<Batch[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await API.get("/subject/getAllSubjects");
        if (response.status !== 200) throw new Error("Failed to fetch subjects");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "subjects" && type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        subjects: checked
          ? [...prev.subjects, value]
          : prev.subjects.filter((subjectId) => subjectId !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && formData._id) {
        const response = await API.put(`/batch/updateBatch/${formData._id}`, formData);
        console.log("Batch updated successfully:", response.data);
      } else {
        const response = await API.post("/batch/addBatch", formData);
        console.log("Batch added successfully:", response.data);
      }
    } catch (error) {
      console.error("Error submitting batch:", error);
    } finally {
      setIsEditing(false);
      setFormData({
        batchName: "",
        batchDuration: "",
        subjects: [],
      });
      setSubmitted((prev) => !prev);
    }
  };

  const handleEdit = (batch: Batch) => {
    setFormData({
      _id: batch._id,
      batchName: batch.batchName,
      batchDuration: batch.batchDuration,
      subjects: batch.subjects,
    });
    setIsEditing(true);
  };

  const handleDelete = async (batchId: string) => {
    try {
      await API.delete(`/batch/deleteBatch/${batchId}`);
      setBatches((prev) => prev.filter((batch) => batch._id !== batchId));
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  const findSubjectName = (subjectId: string) => {
    const subject = subjects.find((sub) => sub._id === subjectId);
    return subject ? subject.subjectName : "Unknown Subject";
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await API.get("/batch/getAllBatches");
        if (response.status !== 200) throw new Error("Failed to fetch batches");
        setBatches(response.data);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, [submitted]);

  return (
    <div className="container mx-auto p-6">
      <BackButton userType={"admin"} />
      <h2 className="text-2xl font-bold text-center mb-6">Manage Batches</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Add / Edit Batch</h3>

          <div className="mb-4">
            <label htmlFor="batchName" className="block text-sm font-medium text-gray-700">
              Batch Name
            </label>
            <input
              type="text"
              id="batchName"
              name="batchName"
              value={formData.batchName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="batchDuration" className="block text-sm font-medium text-gray-700">
              Batch Duration
            </label>
            <input
              type="number"
              id="batchDuration"
              name="batchDuration"
              value={formData.batchDuration}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Subjects</label>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <div key={subject._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={subject._id}
                    name="subjects"
                    value={subject._id}
                    checked={formData.subjects.includes(subject._id)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={subject._id} className="text-sm font-medium text-gray-700">
                    {subject.subjectName}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No subjects available</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? "Update Batch" : "Add Batch"}
          </button>
        </form>

        <div className="flex-1 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Existing Batches</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">Batch Name</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">Duration</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">Subjects</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b text-sm text-gray-700">{batch.batchName}</td>
                    <td className="px-4 py-2 border-b text-sm text-gray-700">{batch.batchDuration}</td>
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
                    <td className="px-4 py-2 border-b text-sm text-gray-700">
                      <button
                        onClick={() => handleEdit(batch)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(batch._id!)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-sm text-gray-700">
                    No batches available
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
