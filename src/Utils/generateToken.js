import jwt from "jsonwebtoken";
import { env } from "#config/Env.js";

const generateToken = (id) => {
    return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken ;