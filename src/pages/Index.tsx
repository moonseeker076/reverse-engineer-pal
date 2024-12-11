import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { findMatches } from '@/utils/matching';
import { notifyAdmin, sendEmail } from '@/utils/email';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Borrower, Lender } from '@/types/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  const [matches, setMatches] = useState<Lender[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Borrower>({
    firstName: '',
    lastName: '',
    businessName: '',
    loanamountrequest: 0,
    industry: '',
    loanTypeyouarerequesting: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'loanamountrequest' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    
    try {
      await handleMatchingProcess(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMatchingProcess = async (borrowerData: Borrower) => {
    console.log('Starting matching process');
    
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
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Lender Matching System</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanamountrequest">Loan Amount Request ($)</Label>
          <Input
            id="loanamountrequest"
            name="loanamountrequest"
            type="number"
            min="0"
            value={formData.loanamountrequest || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanTypeyouarerequesting">Loan Type</Label>
          <Input
            id="loanTypeyouarerequesting"
            name="loanTypeyouarerequesting"
            value={formData.loanTypeyouarerequesting}
            onChange={handleInputChange}
            required
          />
        </div>

        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Find Matching Lenders'}
        </Button>
      </form>

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