import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { findMatches } from '@/utils/matching';
import { notifyAdmin, sendEmail } from '@/utils/email';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Borrower, Lender } from '@/types/types';

const Index = () => {
  const [matches, setMatches] = useState<Lender[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatchingProcess = async (borrowerData: Borrower) => {
    console.log('Starting matching process');
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulated lenders data - in production this would come from your database
      const lenders: Lender[] = [
        {
          lenderName: "Test Lender 1",
          contactEmail: "lender1@test.com",
          LoanAmounts: 50000,
          industries: ["Technology", "Healthcare"],
          loanTypes: ["Term Loan", "Line of Credit"]
        },
        {
          lenderName: "Test Lender 2",
          contactEmail: "lender2@test.com",
          LoanAmounts: 100000,
          industries: ["Retail", "Technology"],
          loanTypes: ["Equipment Financing", "Term Loan"]
        },
        {
          lenderName: "Test Lender 3",
          contactEmail: "lender3@test.com",
          LoanAmounts: 250000,
          industries: ["Manufacturing", "Technology", "Healthcare"],
          loanTypes: ["SBA Loan", "Term Loan", "Line of Credit"]
        }
      ];

      const foundMatches = await findMatches(borrowerData, lenders);
      console.log('Matches found:', foundMatches);
      
      if (foundMatches.length > 0) {
        setMatches(foundMatches);
        
        // Send notifications in parallel
        await Promise.all([
          notifyAdmin(borrowerData, foundMatches),
          sendEmail('member', 'match-notification', {
            SITE_URL: window.location.origin,
            LENDERS: foundMatches
          })
        ]);
        
        toast.success(`Found ${foundMatches.length} matching lenders!`);
      } else {
        toast.warning("No matching lenders found for your criteria");
      }
    } catch (error) {
      console.error('Error in matching process:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast.error("An error occurred during the matching process");
    } finally {
      setIsProcessing(false);
    }
  };

  // Test function to simulate different scenarios
  const runTest = async (scenario: string) => {
    const testBorrower: Borrower = {
      firstName: "Test",
      lastName: "User",
      businessName: "Test Business",
      loanamountrequest: scenario === 'no-matches' ? 1000000000 : 75000,
      industry: "Technology",
      loanTypeyouarerequesting: "Term Loan"
    };

    await handleMatchingProcess(testBorrower);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Lender Matching System</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <Button 
          onClick={() => runTest('normal')}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Test Normal Match'}
        </Button>

        <Button 
          onClick={() => runTest('no-matches')}
          variant="secondary"
          disabled={isProcessing}
        >
          Test No Matches
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Matched Lenders:</h2>
          <div className="space-y-4">
            {matches.map((lender, index) => (
              <div key={index} className="p-4 border rounded-lg bg-background">
                <h3 className="font-medium">{lender.lenderName}</h3>
                <p className="text-sm text-muted-foreground">Contact: {lender.contactEmail}</p>
                <p className="text-sm text-muted-foreground">
                  Loan Amount: ${lender.LoanAmounts.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Industries: {lender.industries.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;