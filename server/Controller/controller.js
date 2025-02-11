import userModel from "../model/user.js"
import bcrypt from "bcryptjs"
import jwtToken from "../middleware/jwttoken.js"
export const home = (req ,res)=>{
    res.send("hello new chat")
}

export const register = async(req,res)=>{
    try {
        const {name,username, email, password} = req.body
    
        const userExist = await userModel.findOne({email})
        if(userExist){
            res.send({msg:"user already exist"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const userCreate = await userModel.create({name,username,email,password:hashPassword})
        if(userCreate){
            const token = jwtToken(userCreate._id.toString());
            return res.status(200).send({ msg: "register successfully", token });
        }
    } catch (error) {
        console.log("register error",error)
    }
   
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return res.status(400).send({ msg: "Please register first" });
        }

        const passCompare = await bcrypt.compare(password, userExist.password);
        if (passCompare) {
            const token = jwtToken(userExist._id.toString());
            return res.status(200).send({ msg: "Login successfully", token });
        } else {
            return res.status(400).send({ msg: "Wrong details" });
        }
    } catch (error) {
        console.error("Login error", error);
        res.status(500).send({ msg: "An error occurred during login" });
    }
};

export const userData = async(req,res)=>{
    try {

        const userData = req.user 
        if(userData){
            return res.status(200).send({userData})
        }
       
    } catch (error) {
        console.log("userData Error",error)
    }
}