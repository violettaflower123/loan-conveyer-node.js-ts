"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conveyerRouter = void 0;
const express_1 = __importDefault(require("express"));
const offers_controller_js_1 = require("../controllers/offers.controller.js");
const calculation_controller_js_1 = require("../controllers/calculation.controller.js");
const router = express_1.default.Router();
exports.conveyerRouter = router;
router.post('/offers', offers_controller_js_1.createOffers);
router.post('/calculation', calculation_controller_js_1.calculateOffer);
//# sourceMappingURL=conveyor.js.map