"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOffers = void 0;
const loanOffers_js_1 = require("../services/loanOffers.js");
const createOffers = async (req, res) => {
    try {
        const loanApplicationRequest = req.body;
        const loanOffers = (0, loanOffers_js_1.calculateLoanOffers)(loanApplicationRequest);
        return res.json(loanOffers);
    }
    catch (err) {
        const error = err;
        return res.status(400).json({ error: error.message });
    }
};
exports.createOffers = createOffers;
//# sourceMappingURL=offers.controller.js.map