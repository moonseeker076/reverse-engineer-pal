import { Borrower, Lender } from "../types/types";

export const sendEmail = async (type: string, templateId: string, variables: any) => {
  console.log('Sending email:', { type, templateId, variables });
  return Promise.resolve(true);
};

export const notifyAdmin = async (borrowerData: Borrower, matches: Lender[]) => {
  console.log('Notifying admin about match:', { borrowerData, matches });
  return Promise.resolve(true);
};