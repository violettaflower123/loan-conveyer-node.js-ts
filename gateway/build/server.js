"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const utils_1 = require("./helpers/utils");
const services_1 = require("./helpers/services");
const app = (0, express_1.default)();
const PORT = 3005;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
async function validateJWT(req, res, next) {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token required');
    }
    try {
        const response = await axios_1.default.post('http://api-auth:3006/validate-token', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data === 'Token is valid') {
            next();
        }
        else {
            return res.status(403).send('Invalid token');
        }
    }
    catch (error) {
        return res.status(500).send('Error validating token');
    }
}
app.use('/deal', validateJWT);
app.use('/conveyor', validateJWT);
app.use('/application', validateJWT);
services_1.services.forEach(service => {
    app.use(service.route, async (req, res, next) => {
        try {
            const response = await (0, axios_1.default)({
                method: req.method,
                url: `${service.baseUrl}${req.url}`,
                data: req.body,
                headers: {
                    Authorization: req.headers.authorization || ''
                }
            });
            res.json(response.data);
        }
        catch (error) {
            next(error);
        }
    });
});
app.use(utils_1.errorHandler);
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map