import jwt from "jsonwebtoken";
import { env } from "#config/Env.js";

const generateToken = (id) => {
    return jwt.sign({ id }, env.jwt_secret, { expiresIn: "30d" });
};

export default generateToken ;