"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculation_controller_1 = require("../controllers/calculation.controller");
const dtos_1 = require("../dtos");
const scoreApplication_1 = require("../services/scoreApplication");
jest.mock('../services/scoreApplication');
// jest.mock('../path/to/calculateCreditParameters');
describe('calculateOffer', () => {
    it('should calculate offer successfully', async () => {
        const mockReq = {
            body: {
                amount: 10000,
                term: 12,
                firstName: "John",
                lastName: "Doe",
                middleName: "M",
                email: "johndoe@example.com",
                birthdate: "1990-01-01",
                passportSeries: "1234",
                passportNumber: "567890",
                gender: dtos_1.Gender.Male,
                passportIssueDate: "2010-01-01",
                passportIssueBranch: "123",
                maritalStatus: dtos_1.MaritalStatus.Single,
                dependentNumber: 0,
                employment: {
                    employmentStatus: dtos_1.EmploymentStatus.Employed,
                    employerINN: "1234567890",
                    salary: 50000,
                    position: dtos_1.Position.Worker,
                    workExperienceTotal: 5,
                    workExperienceCurrent: 3
                },
                account: "1234567890",
                isInsuranceEnabled: false,
                isSalaryClient: false
            },
        };
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        scoreApplication_1.performScoring.mockReturnValue({ passed: true, rate: 0.1, message: "Scoring passed successfully" });
        scoreApplication_1.calculateCreditParameters.mockReturnValue({});
        await (0, calculation_controller_1.calculateOffer)(mockReq, mockRes);
        expect(mockRes.status).not.toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalled();
    });
});
//# sourceMappingURL=calculateOffer.test.js.map