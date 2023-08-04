import { Gender, MaritalStatus, EmploymentStatus, Position, CreditStatus, ChangeType, Status, MessageThemes } from "./types/types.js"

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
export interface  FinishRegistrationRequestDTO
{
  gender: Gender,
  maritalStatus: MaritalStatus,
  dependentNumber: number,
  passportIssueDate: string, // LocalDate
  passportIssueBranch: string,
  employment: EmploymentDTO,
  account: string
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
export interface Credit {
    amount: number,
    term: number,
    monthlyPayment: number,
    rate: number,
    psk: number,
    isInsuranceEnabled: boolean,
    isSalaryClient: boolean,
    paymentSchedule: PaymentScheduleElement[]
    status: CreditStatus
}

export interface ApplicationStatusHistoryDTO {
  status: Status,
  time: string,
  changeType: ChangeType
}

export interface EmailMessage {
  address: string;
  theme: string;
  applicationId: string;
  name: string,
  lastName: string,
  paymentData?: PaymentScheduleElement[],
  clientData?: string,
  creditId?: string,
  amount?: string,
  rate?: string,
  sesCode?: string, 
}

export interface PassportDTO {
  passportId: string,
  series: string,
  number: string,
  issueBranch: string,
  issueDate: string
}
export interface Client {
  clientID: string,
  lastName: string,
  firstName: string,
  middleName: string,
  birthDate: string,
  email: string,
  genderId: number,
  maritalStatus: number,
  dependentAmount: number,
  passportId: string,
  employmentId: string,
  account: string
}

export interface Application {
  application_id: string;
  client_id: number;
  credit_id: number;
  status: Status;
  creationDate: Date;
  appliedOffer: string;
  signDate: Date;
  sesCode: string;
  status_history: ApplicationStatusHistoryDTO[];  
}
