import express from "express";
import { createTimetable, updateTimetable } from "../controllers/timetableController.js";

const timetableRouter = express.Router();

timetableRouter.post("/create-timetable", createTimetable);
timetableRouter.patch("/update-timetable", updateTimetable);

export default timetableRouter;
