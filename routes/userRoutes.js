import express from "express";

import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    getAvailableStudents,
    getAvailableTeachers,
} from  "../controllers/userController.js";

import { ensurePrincipalAuthenticated } from "../middlewares/auth.js";
import { userCreationValidation } from "../middlewares/authValidation.js";


const userRouter = express.Router();

userRouter.post("/create-user", userCreationValidation, createUser);
userRouter.get("/get-users", getUsers);
userRouter.put("/update-user/:id", updateUser);
userRouter.delete("/delete-user/:id",ensurePrincipalAuthenticated, deleteUser);
userRouter.get("/available-students", getAvailableStudents);
userRouter.get("/available-teachers", getAvailableTeachers);

export default userRouter;