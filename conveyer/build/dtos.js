"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = exports.EmploymentStatus = exports.MaritalStatus = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["Male"] = "MALE";
    Gender["Female"] = "FEMALE";
    Gender["NonBinary"] = "NON_BINARY";
})(Gender || (exports.Gender = Gender = {}));
;
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["Married"] = "MARRIED";
    MaritalStatus["Divorced"] = "DIVORCED";
    MaritalStatus["Single"] = "SINGLE";
    MaritalStatus["WidowWidower"] = "WIDOW_WIDOWER";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
;
var EmploymentStatus;
(function (EmploymentStatus) {
    EmploymentStatus["Unemployed"] = "UNEMPLOYED";
    EmploymentStatus["SelfEmployed"] = "SELF_EMPLOYED";
    EmploymentStatus["BusinessOwner"] = "BUSINESS_OWNER";
    EmploymentStatus["Employed"] = "EMPLOYED";
})(EmploymentStatus || (exports.EmploymentStatus = EmploymentStatus = {}));
;
var Position;
(function (Position) {
    Position["MiddleManager"] = "MID_MANAGER";
    Position["TopManager"] = "TOP_MANAGER";
    Position["Worker"] = "WORKER";
    Position["Owner"] = "OWNER";
})(Position || (exports.Position = Position = {}));
;
//# sourceMappingURL=dtos.js.map