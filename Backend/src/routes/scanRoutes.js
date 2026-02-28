import express from "express";
import { scanReceipt } from "../controllers/scanController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("file"), scanReceipt);

export default router;
