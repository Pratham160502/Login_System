import express from "express";
const router = express.Router();
import UserController from "../controller/userController.js";


router.post("/create",  UserController.createUser);

// non authenticated routes
router.post("/login/init", UserController.userLoginInit); // Send OTP for login
router.post("/login/verify", UserController.verifyLogin_otp); // Verify OTP & login

export default router;