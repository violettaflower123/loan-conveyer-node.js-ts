import { calculateLoanOffer } from '../controllers/calculate.controller.js';
import { ScoringDataDTO, EmploymentDTO, Gender, EmploymentStatus, Position, MaritalStatus } from '../dtos.js';
import { performScoring, calculateCreditParameters } from '../services/scoreApplication.js';
import { Request, Response } from 'express';

jest.mock('../services/scoreApplication');
// jest.mock('../path/to/calculateCreditParameters');

describe('calculateOffer', () => {
  it('should calculate offer successfully', async () => {
    const mockReq: Request = {
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
        } as EmploymentDTO,
        account: "1234567890",
        isInsuranceEnabled: false,
        isSalaryClient: false
      } as ScoringDataDTO,
    } as unknown as Request;
    const mockRes: Response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    (performScoring as jest.Mock).mockReturnValue({ passed: true, rate: 0.1, message: "Scoring passed successfully" });
    (calculateCreditParameters as jest.Mock).mockReturnValue({});

    await calculateLoanOffer(mockReq, mockRes);

    expect(mockRes.status).not.toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
