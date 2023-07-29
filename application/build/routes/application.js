import express from 'express';
const router = express.Router();
import { postApplication } from '../controllers/application.controller.js';
import { updateOffer } from '../controllers/offer.controller.js';
import { validateLoanApplicationBody } from '../middlewares/validateLoanApplicationBody.js';
import { validateLoanOffer } from '../middlewares/validateLoanOffer.js';
router.post('/', validateLoanApplicationBody, postApplication);
router.put('/offer', validateLoanOffer, updateOffer);
export { router as applicationRouter };
//# sourceMappingURL=application.js.map