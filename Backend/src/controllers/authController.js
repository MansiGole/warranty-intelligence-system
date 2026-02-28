import { supabase } from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/emailService.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword }])
      .select();

    if (error) throw error;

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
      // We don't want to fail the signup if email fails, so just log it
    }

    res.json({
      message: "User created successfully ✅",
      user: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create JWT token
    const token = jwt.sign(
      {
        userId: data.id,
        email: data.email   // ✅ CORRECT
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: data.id,
        email: data.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
