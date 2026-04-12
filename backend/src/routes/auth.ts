import  Express  from "express";
import { register } from "../controller/register.controller";

const router = Express.Router();

router.post("/register", register);
export default router;