import { Router } from "express";
import { registerUser, loginUser, getMe, googleLogin, verifyOTP, resendOTP } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/me", protect, getMe);

export default router;
