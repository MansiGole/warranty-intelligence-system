import { supabase } from "../config/supabase.js";

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { product_id } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("receipts")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/receipts/${fileName}`;

    const { data: doc, error: dbError } = await supabase
      .from("documents")
      .insert([{ product_id, file_url: fileUrl }])
      .select();

    if (dbError) throw dbError;

    res.json({
      message: "Document uploaded successfully",
      data: doc,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
