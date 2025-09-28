
import User from "../model/user.js";
import { sendOtpEmail, sendInviteEmail } from "../utils/sendMails.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

class UserController {
    // Admin creates new support user (send invitation email)
  static async createUser(req, res) {
    try {
      const { name, email, phone, role, assignedOrgs } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new User({
        name,
        email,
        phone,
        role: role || "support",
        assignedOrgs: assignedOrgs || []
      });

      await user.save();

      // Send invitation email
      const mailSent = await sendInviteEmail(email, name);
      if (!mailSent) {
        return res.status(500).json({ message: "User created but failed to send invite email" });
      }

      res.status(201).json({ message: "User created and invitation sent successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  // Send OTP for login
  static async userLoginInit(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();

      const mailSent = await sendOtpEmail(email, otp, user.name);
      if (!mailSent) return res.status(500).json({ message: "Failed to send OTP email" });

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Verify OTP & return JWT
  static async verifyLogin_otp(req, res) {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.otp = null;
      user.otpExpiry = null;
      user.lastLoginAt = new Date();
      await user.save();
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          assignedOrgs: user.assignedOrgs
        },
        token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async userProfile(req, res) {
    console.log("User profile accessed by:", req.user);
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(200).json({ data: user });
  }

}
export default UserController;