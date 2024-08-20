import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const periodSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  }
});

const timetableSchema = new Schema({
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  periods: [periodSchema]
});

const Timetable = model('Timetable', timetableSchema);

export default Timetable;
