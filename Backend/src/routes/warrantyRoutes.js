import express from "express";
import { addWarranty, getWarranties } from "../controllers/warrantyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addWarranty);
router.get("/", protect, getWarranties); 

export default router;
