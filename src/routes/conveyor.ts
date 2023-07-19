import { LoanApplicationRequestDTO, LoanOfferDTO, ScoringDataDTO } from "../dtos.js";
import express, { Request, Response } from 'express';
import { calculateLoanOffers } from "../loanOffers.js";
import { performScoring, calculateCreditParameters } from "../scoreApplication.js";
const router = express.Router();


router.post("/offers", (req: Request, res: Response) => {
    try {
        const loanApplicationRequest: LoanApplicationRequestDTO = req.body;

        const loanOffers: LoanOfferDTO[] = calculateLoanOffers(loanApplicationRequest);

        res.json(loanOffers);  
    } catch (err) {
        const error = err as Error;
        return res.status(400).json({ error: error.message });
    }

});

router.post("/calculation", (req: Request, res: Response) => {
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

    res.json(credit);

    } catch (err) {
        const error = err as Error;
        return res.status(400).json({ error: error.message });
    }

});

export { router as conveyerRouter };