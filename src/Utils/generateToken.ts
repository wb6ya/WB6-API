import jwt from "jsonwebtoken";
import { env } from "../Config/Env.js";

const generateToken = (id) => {
    return jwt.sign({ id }, env.jwt_secret, { expiresIn: "3d" });
};

export default generateToken ;