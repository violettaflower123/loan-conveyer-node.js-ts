import express, { Request, Response } from 'express';
const router = express.Router();
import { FinishRegistrationRequestDTO, LoanApplicationRequestDTO, LoanOfferDTO, CreditDTO, ApplicationDTO, 
    ApplicationStatusHistoryDTO, ScoringDataDTO, PassportDTO, Status, ChangeType, CreditStatus } from '../dtos.js';
import pgPromise from 'pg-promise';
import axios from 'axios';
import { postApplication } from '../controllers/application.controller.js';
import { validateLoanApplication, addClientAndPassport } from '../service/application.service.js'; 
import { db } from '../db.js';
import { handleOfferUpdate } from "../controllers/offer.controller.js";
import { calculateCredit } from '../controllers/calculate.controller.js';


router.post('/application', postApplication);

router.put('/offer', handleOfferUpdate);

router.put('/calculate/:applicationId', calculateCredit);

export { router as dealRouter };
