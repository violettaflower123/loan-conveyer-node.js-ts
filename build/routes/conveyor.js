import express from 'express';
import { calculateLoanOffers } from "../loanOffers.js";
import { performScoring, calculateCreditParameters } from "../scoreApplication.js";
const router = express.Router();
router.post("/offers", (req, res) => {
    try {
        const loanApplicationRequest = req.body;
        const loanOffers = calculateLoanOffers(loanApplicationRequest);
        res.json(loanOffers);
    }
    catch (err) {
        const error = err;
        return res.status(400).json({ error: error.message });
    }
});
router.post("/calculation", (req, res) => {
    try {
        const scoringData = req.body;
        const scoringResult = performScoring(scoringData);
        if (!scoringResult.passed) {
            return res.status(400).json({ message: scoringResult.message });
        }
        const credit = calculateCreditParameters(scoringData, scoringResult.rate);
        if (!credit) {
            return res.status(400).json({ message: 'The credit cannot be granted.' });
        }
        res.json(credit);
    }
    catch (err) {
        const error = err;
        return res.status(400).json({ error: error.message });
    }
});
export { router as conveyerRouter };
//# sourceMappingURL=conveyor.js.map