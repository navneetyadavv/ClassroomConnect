import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import classroomRouter from './routes/classroomRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRouter.js';
import timetableRouter from './routes/timetableRoutes.js';
import { seedPrincipal } from './services/principalService.js';

dotenv.config();

const app = express();

app.use(express.static(path.resolve(__dirname, 'dist')));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 45000,
}).then(()=>{
    console.log("Database connected Successfully")
}).catch((err)=>{
    console.error(err)
})

app.use(cors());

app.use(express.json());

app.use('/classroom', classroomRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/timetable', timetableRouter);

seedPrincipal();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("listnening on port:  ", PORT)
});
