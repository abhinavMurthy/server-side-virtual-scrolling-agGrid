export interface TransactionEntity {
  accountStatementLineEntityId: string;
  bookingDate: string;
  valueDate: string;
  paymentPurpose: string;
  gvc: string;
  gvcText: string;
  amount: number;
  currency: string;
  transactionState: string;
  preBookedAccountStatement: Boolean;
  iban: string;
  accountName: string;
  bankIcon: string;
  bankIconMobile: string;
}
