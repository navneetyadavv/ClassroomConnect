import User from "../models/User.js";
import Classroom from "../models/Classroom.js";
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.findOne({email});
        if (user) {
            return res.status(409).json({ message: 'User already exists, you can login', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "creating user successful", success: true, newUser });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (!id) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === 'Student') {
      const classroom = await Classroom.findById(user.classroom);
      if (classroom) {
        classroom.students = classroom.students.filter(studentId => studentId.toString() !== id);
        
        await classroom.save();
      }
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('classroom');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAvailableStudents = async (req, res) => {
  try {
    const availableStudents = await User.find({ classroom: null, role: 'Student' });
    res.status(200).json(availableStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableTeachers = async (req, res) => {

  try {
    const availableTeachers = await User.find({ classroom: null, role: 'Teacher' });
    res.status(200).json(availableTeachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
