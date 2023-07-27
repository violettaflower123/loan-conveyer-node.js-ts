import express from 'express';
const router = express.Router();
import { postApplication } from '../controllers/application.controller.js';
import { updateOffer } from '../controllers/offer.controller.js';


router.post('/', postApplication);
router.put('/offer', updateOffer);


export { router as applicationRouter };