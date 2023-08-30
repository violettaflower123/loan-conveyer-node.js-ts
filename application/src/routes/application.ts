import express from 'express';
const router = express.Router();
import { postApplication } from '../controllers/application.controller.js';
import { updateOffer } from '../controllers/offer.controller.js';
import { validateLoanApplicationBody } from '../middlewares/validateLoanApplicationBody.js';
import { validateLoanOffer } from '../middlewares/validateLoanOffer.js';
import { validateJWT } from '../middlewares/validateJWT.js';


router.post('/', validateJWT, validateLoanApplicationBody, postApplication);
router.put('/offer', validateJWT, validateLoanOffer, updateOffer);


export { router as applicationRouter };