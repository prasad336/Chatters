import mongoose from "mongoose";

const connection = async()=>{
    try {
        const connect = await mongoose.connect(process.env.URL)
        if(connect){
            console.log("connected")
        }
        
    } catch (error) {
        console.log("database connection error",error)
    }
   
}
export default connection