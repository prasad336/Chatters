import jwt from "jsonwebtoken";
import userModel from "../model/user.js";

const jwtVerify = async (req, res, next) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(400).send({ msg: "Token not found" });
        }

        // Extract the token properly
        const replaceToken = token.split(" ")[1]; // Correct way to remove "Bearer"

        if (!replaceToken) {
            return res.status(400).send({ msg: "Invalid token format" });
        }

        // Verify the token
        const decode = jwt.verify(replaceToken, process.env.SECRET);

        if (!decode || !decode._id) {
            return res.status(400).send({ msg: "Token not valid" });
        }

        // Find the user in DB
        const findUser = await userModel.findById(decode._id).select("-password");
        if (!findUser) {
            return res.status(404).send({ msg: "User not found" });
        }

        req.user = findUser;
        next();
    } catch (error) {
        console.log("jwtVerify error:", error.message);
        res.status(401).send({ msg: "Invalid token" });
    }
};

export default jwtVerify;
