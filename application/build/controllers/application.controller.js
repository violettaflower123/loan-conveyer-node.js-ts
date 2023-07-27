import { prescoring } from "../services/loanOffers.js";
import axios from "axios";
export const postApplication = async (req, res) => {
    try {
        const loanApplicationRequest = req.body;
        if (!prescoring(loanApplicationRequest)) {
            throw new Error("Invalid request data.");
        }
        console.log('here');
        const response = await axios.post('http://api-deals:3002/deal/application', loanApplicationRequest);
        if (!response.data) {
            throw new Error('Application not found.');
        }
        return res.json(response.data);
    }
    catch (err) {
        const error = err;
        console.log(err);
        if (error.response) {
            const responseData = error.response.data;
            console.log('data111111', responseData);
            return res.status(400).json({ error: responseData || error.message });
        }
        return res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=application.controller.js.map