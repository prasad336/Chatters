import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connection from "./database/db.js"
import router from "./routes/route.js"
import messageRoute from "./routes/messageRoute.js"
import userRoute from "./routes/userRoute.js"
import cors from "cors"
import {app,server} from "./socket/socket.js"


app.use(express.json())

const corsOption = {
    origin:"http://localhost:5173" || "https://chatters-seven.vercel.app",
    methods:"GET, POST, PATCH, DELETE",
    Credentials:true
}
app.use(cors(corsOption))
app.use("/api/auth/",router)
app.use("/api/message/",messageRoute)
app.use("/api/user/",userRoute)


app.get("/",(req,res)=>{
    res.send("hello chat")
})

server.listen(process.env.PORT,()=>{
    connection()
})

