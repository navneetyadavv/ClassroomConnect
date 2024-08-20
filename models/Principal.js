import mongoose from 'mongoose';

const principalSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Principal = mongoose.model('Principal', principalSchema);

export default Principal;
