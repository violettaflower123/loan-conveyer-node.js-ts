export var Gender;
(function (Gender) {
    Gender["Male"] = "MALE";
    Gender["Female"] = "FEMALE";
    Gender["NonBinary"] = "NON_BINARY";
})(Gender || (Gender = {}));
;
export var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["Married"] = "MARRIED";
    MaritalStatus["Divorced"] = "DIVORCED";
    MaritalStatus["Single"] = "SINGLE";
    MaritalStatus["WidowWidower"] = "WIDOW_WIDOWER";
})(MaritalStatus || (MaritalStatus = {}));
;
export var EmploymentStatus;
(function (EmploymentStatus) {
    EmploymentStatus["Unemployed"] = "UNEMPLOYED";
    EmploymentStatus["SelfEmployed"] = "SELF_EMPLOYED";
    EmploymentStatus["BusinessOwner"] = "BUSINESS_OWNER";
    EmploymentStatus["Employed"] = "EMPLOYED";
})(EmploymentStatus || (EmploymentStatus = {}));
;
export var Position;
(function (Position) {
    Position["MiddleManager"] = "MID_MANAGER";
    Position["TopManager"] = "TOP_MANAGER";
    Position["Worker"] = "WORKER";
    Position["Owner"] = "OWNER";
})(Position || (Position = {}));
;
export var Status;
(function (Status) {
    Status["Preapproval"] = "PREAPPROVAL";
    Status["Approved"] = "APPROVED";
    Status["CcDenied"] = "CC_DENIED";
    Status["CcApproved"] = "CC_PAPROVED";
    Status["PrepareDocuments"] = "PREPARE_DOCUMENTS";
    Status["DocumentCreated"] = "DOCUMENT_CREATED";
    Status["ClientDenied"] = "CLIENT_DENIED";
    Status["DocumentSigned"] = "DOCUMENT_SIGNED";
    Status["CreditIssued"] = "CREDIT_ISSUED";
})(Status || (Status = {}));
;
export var ChangeType;
(function (ChangeType) {
    ChangeType["Automatic"] = "AUTOMATIC";
    ChangeType["Manual"] = "MANUAL";
})(ChangeType || (ChangeType = {}));
;
// CREATE TABLE client (
//   client_id BIGINT PRIMARY KEY,
//   last_name VARCHAR(255),
//   first_name VARCHAR(255),
//   middle_name VARCHAR(255),
//   birth_date DATE,
//   email VARCHAR(255),
//   gender_id INT,
//   marital_status_id INT,
//   dependent_amount INT,
//   passport_id VARCHAR(255),
//   employment_id VARCHAR(255),
//   account VARCHAR(255),
//   FOREIGN KEY (gender_id) REFERENCES gender(id),
//   FOREIGN KEY (marital_status_id) REFERENCES marital_status(id)
// );
//# sourceMappingURL=dtos.js.map