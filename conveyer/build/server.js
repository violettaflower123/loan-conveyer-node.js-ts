"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const conveyor_js_1 = require("./routes/conveyor.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/conveyor', conveyor_js_1.conveyerRouter);
const port = 3001;
app.listen((port), () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map