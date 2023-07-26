"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOffer = void 0;
const scoreApplication_1 = require("../services/scoreApplication");
const calculateOffer = async (req, res) => {
    try {
        const scoringData = req.body;
        const scoringResult = (0, scoreApplication_1.performScoring)(scoringData);
        if (!scoringResult.passed) {
            return res.status(400).json({ message: scoringResult.message });
        }
        const credit = (0, scoreApplication_1.calculateCreditParameters)(scoringData, scoringResult.rate);
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
exports.calculateOffer = calculateOffer;
//# sourceMappingURL=calculation.controller.js.map