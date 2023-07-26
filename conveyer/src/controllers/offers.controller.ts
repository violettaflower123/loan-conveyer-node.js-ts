import { Request, Response } from "express";
import { LoanApplicationRequestDTO, LoanOfferDTO } from "../dtos.js";
import { calculateLoanOffers } from "../services/loanOffers.js";

export const createOffers = async (req: Request, res: Response) => {
    try {
        const loanApplicationRequest: LoanApplicationRequestDTO = req.body;

        const loanOffers: LoanOfferDTO[] = calculateLoanOffers(loanApplicationRequest);

        return res.json(loanOffers);  
    } catch (err) {
        const error = err as Error;
        return res.status(400).json({ error: error.message });
    }
}