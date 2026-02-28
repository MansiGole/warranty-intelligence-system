import express from "express";
import { addProduct, getProducts, deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createProductFromScan } from "../controllers/productController.js";


const router = express.Router();

router.post("/", protect, addProduct);
router.get("/", protect, getProducts);
router.delete("/:id", protect, deleteProduct);
router.post("/from-scan", protect, createProductFromScan);


export default router;
