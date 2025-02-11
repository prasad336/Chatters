import express from "express"
import jwtVerify from "../middleware/jwtVerify.js"
import {userBySearch,  myUsers } from "../Controller/userController.js"
const userRoute = express.Router()

userRoute.post("/users",jwtVerify,userBySearch)
userRoute.get("/myusers",jwtVerify,myUsers)

export default userRoute