import Tesseract from "tesseract.js";
import { extractReceiptData } from "../utils/extractReceiptData.js";


export const scanReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Scanning receipt...");

    const result = await Tesseract.recognize(
      req.file.buffer,
      "eng"
    );


    const extractedText = result.data.text;

    // Very basic extraction logic (hackathon enough)
    const extracted = extractReceiptData(extractedText);

    const data = {
      raw_text: extractedText,
      ...extracted
    };


    res.json({
      message: "Confirm extracted data",
      editable: {
        product_name: data.product_name,
        purchase_date: data.purchase_date,
        brand: data.brand
      },
      raw_text: data.raw_text
    });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


