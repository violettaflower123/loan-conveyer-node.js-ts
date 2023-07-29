import axios, { AxiosError } from "axios";
import { ResourceNotFoundError } from "../errors/errorClasses.js";
export const postApplication = async (req, res, next) => {
    try {
        const loanApplicationRequest = req.body;
        const response = await axios.post('http://api-deals:3002/deal/application', loanApplicationRequest);
        if (!response.data) {
            throw new ResourceNotFoundError('Application not found.');
        }
        return res.json(response.data);
    }
    catch (err) {
        if (err instanceof AxiosError) {
            const error = err;
            console.log(err);
            if (error.response) {
                const responseData = error.response.data;
                console.log('data111111', error.response.status);
                return res.status(error.response.status).json({ error: responseData || error.message });
            }
            return res.status(400).json({ error: error.message });
        }
        else {
            next();
        }
    }
};
//# sourceMappingURL=application.controller.js.map