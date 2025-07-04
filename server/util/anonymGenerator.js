import { studentModel } from "../models/studentModel.js"; // ✅ Make sure this import is valid

export const generateAnonymId = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let anonymId = "";
  for (let i = 0; i < 10; i++) {
    anonymId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  // Ensure it's unique
  const exists = await studentModel.findOne({ anonymId });
  if (exists) {
    return generateAnonymId(); // recursion until unique
  }

  return anonymId;
};
