import express from 'express';
import bodyParser from "body-parser";
import { calculateLoanOffers } from "./loanOffers.js";
import { performScoring, calculateCreditParameters } from "./scoreApplication.js";
const app = express();
app.use(bodyParser.json());
app.post("/conveyor/offers", (req, res) => {
    const loanApplicationRequest = req.body;
    const loanOffers = calculateLoanOffers(loanApplicationRequest);
    if (loanOffers.length === 0) {
        return res.status(400).json({ message: 'The application did not pass the data.' });
    }
    res.json(loanOffers);
});
app.post("/conveyor/calculation", (req, res) => {
    const scoringData = req.body;
    const scoringResult = performScoring(scoringData);
    if (!scoringResult.passed) {
        return res.status(400).json({ message: 'The application did not pass the scoring.' });
    }
    const credit = calculateCreditParameters(scoringData, scoringResult.rate);
    if (!credit) {
        return res.status(400).json({ message: 'The credit cannot be granted.' });
    }
    res.json(credit);
});
const port = 3000;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map