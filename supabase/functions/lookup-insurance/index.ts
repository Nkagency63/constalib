
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock insurance database - in a real app, this would be fetched from a database
const mockInsuranceDatabase = [
  {
    policy: "A12345678",
    company: "AXA Assurances",
    name: "Auto Confort",
    logo: "axa-logo.png"
  },
  {
    policy: "M98765432",
    company: "MAIF",
    name: "Auto Tous Risques",
    logo: "maif-logo.png"
  },
  {
    policy: "G45678901",
    company: "Groupama",
    name: "Auto Référence",
    logo: "groupama-logo.png"
  },
  {
    policy: "A87654321",
    company: "Allianz",
    name: "Auto Sur Mesure",
    logo: "allianz-logo.png"
  },
  {
    policy: "M12345678",
    company: "MMA",
    name: "Auto Tous Risques Plus",
    logo: "mma-logo.png"
  },
  {
    policy: "G12345678",
    company: "GMF",
    name: "Auto Pass",
    logo: "gmf-logo.png"
  },
  {
    policy: "D12345678",
    company: "Direct Assurance",
    name: "Auto Eco",
    logo: "direct-assurance-logo.png"
  }
];

// Helper function to normalize policy numbers by removing spaces and dashes
const normalizePolicy = (policy: string): string => {
  return policy.replace(/[\s-]/g, '').toUpperCase();
};

const lookupInsurance = async (policyNumber: string) => {
  console.log(`Looking up insurance policy: ${policyNumber}`);
  
  // Normalize the input policy number
  const normalizedPolicy = normalizePolicy(policyNumber);
  
  // Find a matching policy in our mock database
  // In a real app, this would be a database query
  const matchingInsurance = mockInsuranceDatabase.find(insurance => 
    normalizePolicy(insurance.policy) === normalizedPolicy
  );
  
  if (matchingInsurance) {
    console.log(`Found matching insurance: ${matchingInsurance.company}`);
    return {
      success: true,
      message: `Compagnie d'assurance identifiée: ${matchingInsurance.company}`,
      data: matchingInsurance
    };
  } else {
    console.log(`No matching insurance found for policy: ${policyNumber}`);
    return {
      success: false,
      message: "Aucune assurance trouvée avec ce numéro de police",
      data: null
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const body = await req.json();
    const { policyNumber } = body;
    
    if (!policyNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Numéro de police d'assurance requis"
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400
        }
      );
    }
    
    // Look up the insurance
    const result = await lookupInsurance(policyNumber);
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in lookup-insurance function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Erreur lors de la recherche de l'assurance: ${error.message}`
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500
      }
    );
  }
});
