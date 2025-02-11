import express from "express"
import {home,register,login ,userData} from "../Controller/controller.js"

import jwtVerify from "../middleware/jwtVerify.js"

const router = express.Router()

router.get("/", home)
router.post("/register",register)
router.post("/login",login)
router.get("/userdata",jwtVerify,userData)

export default router

