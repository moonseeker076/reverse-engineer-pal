import { Borrower, Lender } from "../types/types";

export const findMatches = async (borrower: Borrower, lenders: Lender[]): Promise<Lender[]> => {
  console.log('Starting findMatches with borrower:', borrower);
  
  try {
    // Improved matching logic with weighted scoring
    const matches = lenders
      .map(lender => {
        let score = 0;
        
        // Check loan amount (must match)
        if (lender.LoanAmounts >= borrower.loanamountrequest) {
          score += 100;
        } else {
          return { lender, score: -1 }; // Disqualify if loan amount doesn't match
        }
        
        // Check industry match
        if (lender.industries.includes(borrower.industry)) {
          score += 50;
        }
        
        // Check loan type match
        if (lender.loanTypes.includes(borrower.loanTypeyouarerequesting)) {
          score += 50;
        }
        
        return { lender, score };
      })
      .filter(({ score }) => score > 0) // Remove disqualified lenders
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map(({ lender }) => lender) // Extract just the lender objects
      .slice(0, 3); // Limit to top 3 matches

    console.log('Matches found:', matches);
    return matches;
  } catch (error) {
    console.error('Error in findMatches:', error);
    throw error;
  }
};