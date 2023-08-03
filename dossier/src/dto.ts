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
  paymentData?: string,
  clientData?: {[key: string]: any}
}
