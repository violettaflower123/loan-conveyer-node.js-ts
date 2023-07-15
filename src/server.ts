import { LoanApplicationRequestDTO, LoanOfferDTO, ScoringDataDTO } from "./dtos.js";
import express, { Request, Response } from 'express';
// import bodyParser from "body-parser";
import { calculateLoanOffers } from "./loanOffers.js";
import { performScoring, calculateCreditParameters } from "./scoreApplication.js";

const app = express();

app.use(express.json());

app.post("/conveyor/offers", (req: Request, res: Response) => {
    try {
        const loanApplicationRequest: LoanApplicationRequestDTO = req.body;

        const loanOffers: LoanOfferDTO[] = calculateLoanOffers(loanApplicationRequest);

        res.json(loanOffers);  
    } catch (err) {
        const error = err as Error;
        return res.status(400).json({ error: error.message });
    }

});

app.post("/conveyor/calculation", (req: Request, res: Response) => {
    try {
    const scoringData: ScoringDataDTO = req.body;
    const scoringResult = performScoring(scoringData);

    if (!scoringResult.passed) {
        return res.status(400).json({message: 'The application did not pass the scoring.'});
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


const port = 3000;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`)
})

