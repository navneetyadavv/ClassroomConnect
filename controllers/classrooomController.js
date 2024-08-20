import Classroom from "../models/Classroom.js";
import User from "../models/User.js";

export const createClassroom = async (req, res) => {
  try {
    const { name, schedule, teacher, students } = req.body;
    const classroom = new Classroom({
      name,
      schedule,
      teacher: teacher || null,
      students: students || null,
    });
    await classroom.save();

    if (students && students.length > 0) {
      await User.updateMany(
        { _id: { $in: students }, role: "Student" },
        { $set: { classroom: classroom._id } }
      );
    }

    if (teacher) {
      await User.updateOne(
        { _id: teacher, role: "Teacher" },
        { $set: { classroom: classroom._id } }
      );
    }
    res.status(201).json({
      message: "Classroom created successfully",
      classroom,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create classroom",
      error: error.message,
    });
  }
};

export const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    await User.updateMany({ classroom: id }, { $set: { classroom: null } });
    await Classroom.findByIdAndDelete(id);
    res.status(200).json({ message: "Classroom deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete classroom", error: error.message });
  }
};

export const getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find()
      .populate("teacher")
      .populate("students")
      .populate("timetables");

    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const assignTeacherToClassroom = async (req, res) => {
  try {
    const { classroomId, teacherId } = req.body;
    const classroom = await Classroom.findById(classroomId);
    const teacher = await User.findById(teacherId);
    if (!classroom.teacher) {
      classroom.teacher = teacherId;
      teacher.classroom = classroomId;
      await teacher.save();
      await classroom.save();
      res.status(200).json({ message: "Teacher assigned to classroom" });
    } else {
      res.status(400).json({ message: "Classroom already has a teacher" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const removeTeacherFromClassroom = async (req, res) => {
  try {
    const { classroomId } = req.body;
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }
    const teacherId = classroom.teacher;
    const teacher = await User.findById(teacherId);
    teacher.classroom = null;
    classroom.teacher = null;
    await teacher.save();
    await classroom.save();
    res.status(200).json({ message: "Teacher removed from classroom" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const assignStudentInClassroom = async (req, res) => {
  try {
    const { classroomId, newStudents } = req.body;
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const currentStudents = classroom.students.map((student) =>
      student.toString()
    );

    const studentsToAdd = newStudents.filter(
      (studentId) => !currentStudents.includes(studentId)
    );
    const studentsToRemove = currentStudents.filter(
      (studentId) => !newStudents.includes(studentId)
    );

    classroom.students = newStudents;
    await classroom.save();

    await User.updateMany(
      { _id: { $in: studentsToAdd }, role: "Student" },
      { $set: { classroom: classroomId } }
    );

    await User.updateMany(
      { _id: { $in: studentsToRemove }, role: "Student" },
      { $set: { classroom: null } }
    );

    res
      .status(200)
      .json({ message: "Classroom students updated successfully", classroom });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
