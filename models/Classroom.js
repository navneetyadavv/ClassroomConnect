import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js'; 


const { Schema, model } = mongoose;

const scheduleSchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    }
  },
});

const classroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  schedule: [scheduleSchema],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    default: null
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  timetables: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Timetable',
    }
  ]
});

const Classroom = model('Classroom', classroomSchema);

export default Classroom;
