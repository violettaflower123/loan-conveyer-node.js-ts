jest.mock('../db.js', () => {
  const actualDb = jest.requireActual('../db.js');
  return {
      ...actualDb,
      db: {
          one: jest.fn()
      }
  };
});

import { db, pgp } from '../db.js';
import { calculateLoanOffer } from '../controllers/calculate.controller.js'; 
import { ScoringDataDTO, EmploymentDTO } from '../dtos.js';
import { Gender, EmploymentStatus, Position, MaritalStatus } from '../types/types.js';
import { performScoring, calculateCreditParameters } from '../services/scoreApplication.js';
import { Request, Response } from 'express';



jest.mock('../services/scoreApplication');

jest.mock('../services/kafka.service.js', () => ({
  producer: {
    connect: jest.fn(),
  },
  sendMessage: jest.fn()
}));

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

    const mockClientData = {
        client_id: 12345,
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com"
    };

    (db.one as jest.Mock).mockImplementation((query, values) => {
      if (typeof query === 'string' && query.includes('SELECT client.client_id, client.first_name, client.last_name FROM client') && 
          values[0] === mockReq.body.passportSeries && 
          values[1] === mockReq.body.passportNumber) {
          return Promise.resolve(mockClientData);
      }
      if (typeof query === 'string' && query.includes('SELECT email FROM client WHERE client_id = $1')) {
          return Promise.resolve({ email: 'testEmail@example.com' });
      }
      return Promise.reject(new Error(`Query not mocked: ${query} with values ${JSON.stringify(values)}`));
    });
  
  
    await calculateLoanOffer(mockReq, mockRes, () => {});

    expect(mockRes.status).not.toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalled();
  });
});

afterAll(() => {
  pgp.end(); 
});
