import { supabase } from "../config/supabase.js";
import { sendWarrantyEmail } from "../services/emailService.js";

/* ================= ADD PRODUCT ================= */
export const addProduct = async (req, res) => {
  try {
    const { name, brand, category, purchase_date } = req.body;
    const { userId, email } = req.user;

    // 1. Insert Product
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          brand,
          category,
          purchase_date,
          user_id: userId
        }
      ])
      .select();

    if (error) throw error;

    const product = data[0];

    // 2. Create Default Warranty (1 Year)
    const durationMonths = 12;
    const purchaseDateObj = new Date(purchase_date);
    const expiryDate = new Date(purchaseDateObj);
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    const status = expiryDate > new Date() ? "active" : "expired";

    await supabase.from("warranties").insert([
      {
        product_id: product.id,
        duration_months: durationMonths,
        expiry_date: expiryDate,
        status
      }
    ]);

    // 3. Send Email
    try {
      await sendWarrantyEmail(email, product.name, expiryDate.toDateString());
    } catch (emailErr) {
      console.error("Failed to send product registration email:", emailErr);
    }

    res.json({
      message: "Product added & warranty registered ✅",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET USER PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProductFromScan = async (req, res) => {
  try {
    const { product_name, brand, purchase_date } = req.body;

    if (!product_name || !purchase_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { userId, email } = req.user;

    // create product
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: product_name,
          brand,
          purchase_date,
          user_id: userId
        }
      ])
      .select();

    if (error) throw error;

    const productId = data[0].id;

    /* ================= AUTO WARRANTY CREATION ================= */

    const durationMonths = 12; // default warranty

    const purchaseDateObj = new Date(purchase_date);
    const expiryDate = new Date(purchaseDateObj);
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

    const status = expiryDate > new Date() ? "active" : "expired";

    await supabase.from("warranties").insert([
      {
        product_id: productId,
        duration_months: durationMonths,
        expiry_date: expiryDate,
        status
      }
    ]);

    /* ======================================================= */

    // Send Email
    try {
      await sendWarrantyEmail(email, product_name, expiryDate.toDateString());
    } catch (emailErr) {
      console.error("Failed to send product registration email:", emailErr);
    }

    res.json({
      message: "Product + warranty created successfully 🚀",
      data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
