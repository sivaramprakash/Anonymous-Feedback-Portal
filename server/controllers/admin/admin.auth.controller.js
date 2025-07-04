import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { adminModel } from "../../models/adminModel.js";

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await adminModel.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
      userType: "admin",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const adminRegister = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingAdmin = await adminModel.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
      username,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error during admin registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const adminLogout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
