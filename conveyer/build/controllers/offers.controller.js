import { calculateLoanOffers } from "../services/loanOffers.js";
export const createOffers = async (req, res) => {
    try {
        const loanApplicationRequest = req.body;
        const loanOffers = calculateLoanOffers(loanApplicationRequest);
        return res.json(loanOffers);
    }
    catch (err) {
        const error = err;
        return res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=offers.controller.js.map