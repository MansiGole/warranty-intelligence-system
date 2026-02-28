import { supabase } from "../config/supabase.js";
import { sendWarrantyEmail } from "../services/emailService.js";


export const addWarranty = async (req, res) => {
  console.log("USER EMAIL:", req.user.email);

  try {
    const { product_id, duration_months, purchase_date } = req.body;

    /* ---------- calculate expiry ---------- */
    const expiryDate = new Date(purchase_date);
    expiryDate.setMonth(expiryDate.getMonth() + duration_months);

    /* ---------- save warranty ---------- */
    const { data, error } = await supabase
      .from("warranties")
      .insert([
        {
          product_id,
          duration_months,
          expiry_date: expiryDate
        }
      ])
      .select();

    if (error) throw error;

    /* ---------- get product name ---------- */
    const { data: product } = await supabase
      .from("products")
      .select("name")
      .eq("id", product_id)
      .single();

    /* ---------- send email (IMPORTANT PART) ---------- */
    if (req.user?.email && product?.name) {
      await sendWarrantyEmail(
        req.user.email,
        product.name,
        expiryDate
      );
    }

    res.json({
      message: "Warranty added + email sent 🚀",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWarranties = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("warranties")
      .select("*");

    if (error) throw error;

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
