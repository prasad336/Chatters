import express from "express"
const messageRoute = express.Router()
import { sendMessage,getMessage } from "../Controller/messageController.js"
import jwtVerify from "../middleware/jwtVerify.js"
messageRoute.post("/send/:id",jwtVerify,sendMessage)
messageRoute.get("/:id",jwtVerify,getMessage)


export default messageRoute