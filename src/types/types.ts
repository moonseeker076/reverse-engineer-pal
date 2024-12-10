export interface Borrower {
  firstName: string;
  lastName: string;
  businessName: string;
  loanamountrequest: number;
  industry: string;
  loanTypeyouarerequesting: string;
}

export interface Lender {
  lenderName: string;
  contactEmail: string;
  LoanAmounts: number;
  industries: string[];
  loanTypes: string[];
}