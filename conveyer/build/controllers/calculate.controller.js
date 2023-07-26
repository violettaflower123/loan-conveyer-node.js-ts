import { calculateCreditParameters } from "../services/scoreApplication.js";
import { performScoring } from "../services/scoreApplication.js";
export const calculateLoanOffer = async (req, res) => {
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
        return res.json(credit);
    }
    catch (err) {
        const error = err;
        return res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=calculate.controller.js.map