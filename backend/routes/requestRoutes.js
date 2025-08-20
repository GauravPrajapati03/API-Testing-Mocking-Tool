import express from "express";
import { saveRequest, getRequests, executeRequest } from "../controllers/requestController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/save", authMiddleware, saveRequest);
router.get("/", authMiddleware, getRequests);
router.post("/execute", authMiddleware, executeRequest);

export default router;
