import { supabase } from "../config/supabase.js";
import {
  sendWarrantyReminder7Days,
  sendWarrantyReminder30Days,
  sendWarrantyExpiredEmail
} from "./emailService.js";

export const checkWarrantyReminders = async () => {
  try {
    console.log("🔔 Checking expiring warranties...");

    const today = new Date();

    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);

    const in30Days = new Date();
    in30Days.setDate(today.getDate() + 30);

    // get all warranties
    const { data: warranties, error } = await supabase
      .from("warranties")
      .select("*");

    if (error) throw error;

    for (const warranty of warranties) {
      const expiry = new Date(warranty.expiry_date);

      // get product
      const { data: product } = await supabase
        .from("products")
        .select("name, user_id")
        .eq("id", warranty.product_id)
        .single();

      if (!product) continue;

      // get user email
      const { data: user } = await supabase
        .from("users")
        .select("email")
        .eq("id", product.user_id)
        .single();

      if (!user) continue;

      const expiryStr = expiry.toDateString();

      /* ===== 30 DAY REMINDER ===== */
      if (expiryStr === in30Days.toDateString()) {
        await sendWarrantyReminder30Days(
          user.email,
          product.name,
          expiry.toDateString()
        );
        console.log("📧 30 day reminder sent →", user.email);
      }

      /* ===== 7 DAY REMINDER ===== */
      if (expiryStr === in7Days.toDateString()) {
        await sendWarrantyReminder7Days(
          user.email,
          product.name,
          expiry.toDateString()
        );
        console.log("📧 7 day reminder sent →", user.email);
      }

      /* ===== EXPIRED ===== */
      if (expiry < today) {
        await sendWarrantyExpiredEmail(
          user.email,
          product.name
        );
        console.log("❌ Expired mail sent →", user.email);
      }
    }

  } catch (err) {
    console.error("Reminder job error:", err.message);
  }
};
