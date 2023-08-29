import axios from 'axios';
import { LoanApplicationRequestDTO, LoanOfferDTO } from '../dtos.js';

export const postApplicationToApiDeals = async (loanApplicationRequest: LoanApplicationRequestDTO) => {
    return await axios.post('http://api-deals:3002/deal/application', loanApplicationRequest);
};

export const updateOfferToApiDeals = async (loanOffer: LoanOfferDTO) => {
    return await axios.put('http://api-deals:3002/deal/offer', loanOffer);
};
