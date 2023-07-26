import { Request, Response } from "express";
import { calculateCreditParameters } from "../services/scoreApplication.js";
import { performScoring } from "../services/scoreApplication.js";
import { ScoringDataDTO } from "../dtos.js";

export const calculateLoanOffer = async (req: Request, res: Response) => {
    try {
        const scoringData: ScoringDataDTO = req.body;
        const scoringResult = performScoring(scoringData);
    
        if (!scoringResult.passed) {
            return res.status(400).json({message: scoringResult.message});
        }
    
        const credit = calculateCreditParameters(scoringData, scoringResult.rate);
    
        if (!credit) {
            return res.status(400).json({message: 'The credit cannot be granted.'});
        }
        return res.json(credit);
    } catch (err) {
        const error = err as Error;
        return res.status(400).json({ error: error.message });
    }
    
}