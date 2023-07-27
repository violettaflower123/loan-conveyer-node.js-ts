import axios from "axios";
export const updateOffer = async (req, res) => {
    try {
        const loanOffer = req.body;
        const response = await axios.put('http://api-deals:3002/deal/offer ', loanOffer);
        if (!response.data) {
            throw new Error('Something went wrong when reaching /deal/offer');
        }
        return res.status(200).json({ message: 'Application is updated successfully' });
    }
    catch (err) {
        const error = err;
        console.log(err);
        if (error.response) {
            const responseData = error.response.data;
            return res.status(400).json({ error: responseData || error.message });
        }
        return res.status(400).json({ error: error.message });
    }
};
//# sourceMappingURL=offer.controller.js.map