import { Request, Response } from "express";
import Student from "../models/Student";
import {
  encryptBackendData,
  decryptBackendData,
  decryptFrontendData,
} from "../utils/crypto";

// CREATE
export const registerStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Encrypted student data is required",
      });
    }

    
    const doubleEncryptedData = encryptBackendData(data);

    const student = await Student.create({
      encryptedData: doubleEncryptedData,
    });

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      studentId: student._id,
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register student",
    });
  }
};

// READ
export const getStudents = async (
  _req: Request,
  res: Response
) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1,
    });

    const result = students.map((student) => {
      // Remove backend encryption layer.
      // The remaining data is still encrypted for the frontend.
      const frontendEncryptedData = decryptBackendData(
        student.encryptedData
      );

      return {
        id: student._id,
        data: frontendEncryptedData,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      students: result,
    });
  } catch (error) {
    console.error("Get students error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// UPDATE
export const updateStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Encrypted student data is required",
      });
    }

    const doubleEncryptedData = encryptBackendData(data);

    const student = await Student.findByIdAndUpdate(
      id,
      {
        encryptedData: doubleEncryptedData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("Update error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

// DELETE
export const deleteStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};


// LOGIN
export const loginStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const students = await Student.find();

    for (const student of students) {
      try {
        const frontendEncryptedData =
          decryptBackendData(student.encryptedData);

        const decryptedJson =
          decryptFrontendData(frontendEncryptedData);

        const studentData = JSON.parse(decryptedJson);

        if (
          studentData.email === email &&
          studentData.password === password
        ) {
          return res.status(200).json({
            success: true,
            message: "Login successful",
          });
        }
      } catch (error) {
        console.error(
          `Could not decrypt student ${student._id}:`,
          error
        );

        continue;
      }
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};