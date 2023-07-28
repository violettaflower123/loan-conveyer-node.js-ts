import { calculateLoanOffer } from '../controllers/calculate.controller.js';
import { Gender, EmploymentStatus, Position, MaritalStatus } from '../types/types.js';
import { performScoring, calculateCreditParameters } from '../services/scoreApplication.js';
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
                gender: Gender.Male,
                passportIssueDate: "2010-01-01",
                passportIssueBranch: "123",
                maritalStatus: MaritalStatus.Single,
                dependentNumber: 0,
                employment: {
                    employmentStatus: EmploymentStatus.Employed,
                    employerINN: "1234567890",
                    salary: 50000,
                    position: Position.Worker,
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
        performScoring.mockReturnValue({ passed: true, rate: 0.1, message: "Scoring passed successfully" });
        calculateCreditParameters.mockReturnValue({});
        await calculateLoanOffer(mockReq, mockRes);
        expect(mockRes.status).not.toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalled();
    });
});
//# sourceMappingURL=calculateOffer.test.js.map