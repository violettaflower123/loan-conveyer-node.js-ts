export enum Gender { Male = "MALE",  Female = "FEMALE", NonBinary = "NON_BINARY" };
export enum MaritalStatus {Married = "MARRIED" , Divorced = "DIVORCED" , Single = "SINGLE", WidowWidower = "WIDOW_WIDOWER"} ;
export enum EmploymentStatus {Unemployed = "UNEMPLOYED" , SelfEmployed = "SELF_EMPLOYED" , BusinessOwner = "BUSINESS_OWNER", Employed = "EMPLOYED"} ;
export enum Position {MiddleManager = "MID_MANAGER" , TopManager = "TOP_MANAGER" , Worker = "WORKER", Owner = "OWNER"};
export enum Status { Preapproval = "PREAPPROVAL", Approved = "APPROVED", CcDenied = "CC_DENIED", CcApproved = "CC_PAPROVED", PrepareDocuments = "PREPARE_DOCUMENTS", DocumentCreated = "DOCUMENT_CREATED", ClientDenied = "CLIENT_DENIED", DocumentSigned = "DOCUMENT_SIGNED", CreditIssued = "CREDIT_ISSUED" };
export enum ChangeType { Automatic = "AUTOMATIC", Manual = "MANUAL" }; 
export enum CreditStatus { Calculated = "CALCULATED", Issued = "ISSUED"};

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
    applicationId: number,
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
    email: string,
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
    status: CreditStatus
}

export interface ApplicationStatusHistoryDTO {
  status: Status,
  time: string, // LocalDateTime
  changeType: ChangeType
}

export interface EmailMessage
{
  address: "string",
  theme: "Enum",
  applicationId: "number"
}
export interface PassportDTO {
  passportId: string,
  series: string,
  number: string,
  issueBranch: string,
  issueDate: string
}
export interface ClientDTO {
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

export interface ApplicationDTO {
  id: string;
  clientId: number;
  creditId: number;
  status: Status;
  creationDate: Date;
  appliedOffer: string;
  signDate: Date;
  sesCode: string;
  statusHistory: ApplicationStatusHistoryDTO[];  // Замените на соответствующий тип, если структура JSON известна
}
