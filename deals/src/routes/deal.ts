import express from 'express';
const router = express.Router();
import { postApplication } from '../controllers/application.controller.js';
import { handleOfferUpdate } from "../controllers/offer.controller.js";
import { calculateCredit } from '../controllers/calculate.controller.js';


router.post('/application', postApplication);

router.put('/offer', handleOfferUpdate);

router.put('/calculate/:applicationId', calculateCredit);

export { router as dealRouter };
