import express from "express";
import { saveRequest, executeRequest, getHistory } from "../controllers/requestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveRequest);
// router.get("/", authMiddleware, getRequests);
router.get("/history", authMiddleware, getHistory);
router.post("/execute", authMiddleware, executeRequest);

export default router;
