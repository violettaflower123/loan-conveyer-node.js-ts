import express from 'express';
import { createOffers } from "../controllers/offers.controller.js";
import { calculateOffer } from "../controllers/calculation.controller.js";
const router = express.Router();


router.post('/offers', createOffers);

router.post('/calculation', calculateOffer);

export { router as conveyerRouter };