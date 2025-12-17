import express from "express";
import { predictRisk } from "../controller/risk.controller.js";

const router = express.Router();

router.post("/predict", predictRisk);

export default router;
