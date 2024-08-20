import express from "express";

import {
    createClassroom,
    getClassrooms,
    deleteClassroom,
    removeTeacherFromClassroom,
    assignTeacherToClassroom,
    assignStudentInClassroom
} from "../controllers/classrooomController.js";

import { ensurePrincipalAuthenticated } from "../middlewares/auth.js";


const classroomRouter = express.Router();

classroomRouter.post("/create-classroom", ensurePrincipalAuthenticated, createClassroom);
classroomRouter.get("/get-classrooms", getClassrooms);
classroomRouter.delete("/delete-classroom/:id", ensurePrincipalAuthenticated, deleteClassroom);
classroomRouter.patch("/remove-teacher", ensurePrincipalAuthenticated, removeTeacherFromClassroom)
classroomRouter.post("/assign-teacher", ensurePrincipalAuthenticated, assignTeacherToClassroom)
classroomRouter.put("/update-students-inclassroom", ensurePrincipalAuthenticated, assignStudentInClassroom)


export default classroomRouter