import express from "express";
import protect from "../middlewares/authMiddleware";
import { enchanceJobDescription, enchanceProfessionalSummary } from "../controllers/aiController.js";
import { updateResume } from "../controllers/resumeController";

const aiRouter = express.Router();


aiRouter.post('/enhance-pro-sum',protect,enchanceProfessionalSummary );
aiRouter.post('/enhance-job-desc',protect,enchanceJobDescription );
aiRouter.post('/upload-resume',protect,updateResume );

export default aiRouter;
