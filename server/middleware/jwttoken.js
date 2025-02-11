import jwt from "jsonwebtoken"
const jwtToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.SECRET, { expiresIn: "1d" });
};

export default jwtToken;