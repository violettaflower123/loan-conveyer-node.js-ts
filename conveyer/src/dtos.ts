import { Gender, EmploymentStatus, Position, MaritalStatus } from "./types/types.js";

export interface LoanApplicationRequestDTO {
    amount: number,
    term: number,
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    birthdate: string, // LocalDate
    passportSeries: string,
    passportNumber: string
}

export interface LoanOfferDTO {
    applicationId: string,
    requestedAmount: number,
    totalAmount: number,
    term: number,
    monthlyPayment: number,
    rate: number,
    isInsuranceEnabled: boolean,
    isSalaryClient: boolean
}

export interface EmploymentDTO {
    employmentStatus: EmploymentStatus,
    employerINN: string,
    salary: number,
    position: Position,
    workExperienceTotal: number,
    workExperienceCurrent: number
}

export interface ScoringDataDTO {
    amount: number,
    term: number,
    firstName: string,
    lastName: string,
    middleName: string,
    birthdate: string, // LocalDate
    passportSeries: string,
    passportNumber: string
    gender: Gender,
    passportIssueDate: string, // LocalDate
    passportIssueBranch: string,
    maritalStatus: MaritalStatus,
    dependentNumber: number,
    employment: EmploymentDTO,
    account: string,
    isInsuranceEnabled: boolean,
    isSalaryClient: boolean
}
export interface PaymentScheduleElement {
    number: number,
    date: string, // LocalDate
    totalPayment: number,
    interestPayment: number,
    debtPayment: number,
    remainingDebt: number
}
export interface CreditDTO {
    amount: number,
    term: number,
    monthlyPayment: number,
    rate: number,
    psk: number,
    isInsuranceEnabled: boolean,
    isSalaryClient: boolean,
    paymentSchedule: PaymentScheduleElement[]
}

export interface EmailMessage {
    address: string;
    theme: string;
    applicationId?: string;
    name: string,
    lastName: string,
    paymentData?: PaymentScheduleElement[],
    clientData?: string,
    creditId?: string,
    amount?: string,
    rate?: string,
    sesCode?: string, 
  }

