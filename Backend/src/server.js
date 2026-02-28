import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import warrantyRoutes from "./routes/warrantyRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";
import cron from "node-cron";
import { checkWarrantyReminders } from "./services/reminderService.js";






dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ROOT ROUTE */
app.get("/", (req, res) => {
  res.send("Warranty Management API Running 🚀");
});

/* SUPABASE TEST ROUTE */
app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;

    res.json({
      message: "Supabase connected successfully ✅",
      data
    });

  } catch (err) {
    res.status(500).json({
      message: "Supabase connection failed ❌",
      error: err.message
    });
  }
});

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);

/* PRODUCT ROUTES */
app.use("/api/products", productRoutes);

/* WARRANTY ROUTES — ADD HERE */
app.use("/api/warranties", warrantyRoutes);

/* DOCUMENT ROUTES */
app.use("/api/documents", documentRoutes);

/* SCAN ROUTES */
app.use("/api/scan-receipt", scanRoutes);

/* ================= WARRANTY REMINDER CRON ================= */

// runs every day at 9 AM REMEMBER TO CHANGE THIS TO YOUR TIMEZONE
cron.schedule("0 9 * * *", () => {
  console.log("Running warranty reminder job...");
  checkWarrantyReminders();
});
/* ================= MANUAL REMINDER TEST ROUTE ================= */
app.get("/test-reminder", async (req, res) => {
  try {
    await checkWarrantyReminders();
    res.send("✅ Reminder check executed — emails sent if any due");
  } catch (err) {
    res.status(500).send(err.message);
  }
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
