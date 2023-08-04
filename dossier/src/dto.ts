export interface PaymentScheduleElement {
  number: number,
  date: string, // LocalDate
  totalPayment: number,
  interestPayment: number,
  debtPayment: number,
  remainingDebt: number
}
export interface EmailMessage {
  address: string;
  theme: string;
  applicationId: number;
  name: string,
  lastName: string,
  paymentData?: PaymentScheduleElement[],
  clientData?: string,
  amount?: string,
  rate?: string,
  sesCode?: string 
}
export interface Client {
  client_id: string,
  last_name: string,
  first_name: string,
  middle_name: string,
  birth_date: string,
  email: string,
  genderId: number,
  maritalStatus: number,
  dependentAmount: number,
  passportId: string,
  employmentId: string,
  account: string
}
