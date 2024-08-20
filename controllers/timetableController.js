import Timetable from "../models/Timetable.js";
import Classroom from "../models/Classroom.js";

export const createTimetable = async (req, res) => {
  try {
    const { classroomId, timetable } = req.body;
    const timetableEntries = timetable.map(dayTimetable => ({
      classroom: classroomId,
      day: dayTimetable.day,
      periods: dayTimetable.periods,
    }));

    const insertedTimetables = await Timetable.insertMany(timetableEntries);
    const timetableIds = insertedTimetables.map(t => t._id);

    await Classroom.findByIdAndUpdate(classroomId, {
      $push: { timetables: { $each: timetableIds } }
    });

    res.status(201).json({ message: 'Timetable saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save timetable', error });
  }
};

export const updateTimetable = async (req, res) => {
  try {
    const { classroomId, timetable } = req.body;

    await Timetable.deleteMany({ classroom: classroomId });
    const timetableEntries = timetable.map(dayTimetable => ({
      classroom: classroomId,
      day: dayTimetable.day,
      periods: dayTimetable.periods,
    }));
    const insertedTimetables = await Timetable.insertMany(timetableEntries);
    const timetableIds = insertedTimetables.map(t => t._id);
    await Classroom.findByIdAndUpdate(classroomId, {
      timetables: timetableIds
    });

    res.status(200).json({ message: 'Timetable updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update timetable', error });
  }
};

export const patchTimetable = async (req, res) => {
  try {
    const { classroomId, timetable } = req.body;

    for (const dayTimetable of timetable) {
      await Timetable.findOneAndUpdate(
        { classroom: classroomId, day: dayTimetable.day },
        { periods: dayTimetable.periods },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({ message: 'Timetable patched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to patch timetable', error });
  }
};
