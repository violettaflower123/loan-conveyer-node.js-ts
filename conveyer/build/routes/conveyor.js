import express from 'express';
import { createOffers } from "../controllers/offers.controller.js";
import { calculateLoanOffer } from "../controllers/calculate.controller.js";
import { validateLoanApplicationBody } from '../middlewares/validationMiddleware.js';
const router = express.Router();
router.post('/offers', validateLoanApplicationBody, createOffers);
router.post('/calculation', calculateLoanOffer);
export { router as conveyerRouter };
//# sourceMappingURL=conveyor.js.map