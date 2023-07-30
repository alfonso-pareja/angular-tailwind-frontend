export interface Transactions {
    transactionId:     number;
    senderAccountId:   number;
    receiverAccountId: number;
    amount:            number;
    receiverAccountName: string;
    transactionNumber: number;
    transactionDate:   string;
    transactionType:   string;
    status:            string;
    updated:           string;
}