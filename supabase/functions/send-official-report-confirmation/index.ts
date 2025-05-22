
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { email, referenceId, reportDetails } = await req.json();

    if (!email || !referenceId) {
      throw new Error("Missing required parameters: email and referenceId");
    }
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    // Format the email content
    const date = new Date().toLocaleDateString('fr-FR');
    const time = new Date().toLocaleTimeString('fr-FR');
    
    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Confirmation de Constat Amiable</h1>
          <p style="color: #4b5563; font-size: 16px;">E-Constat enregistré avec succès</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 16px;">Numéro de référence: <strong style="color: #2563eb;">${referenceId}</strong></p>
        </div>
        
        <p style="color: #4b5563; line-height: 1.5;">Bonjour,</p>
        
        <p style="color: #4b5563; line-height: 1.5;">
          Nous vous confirmons l'enregistrement de votre constat électronique concernant l'accident survenu 
          le <strong>${reportDetails.date}</strong> à <strong>${reportDetails.time}</strong> à <strong>${reportDetails.location}</strong>.
        </p>
        
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb; background-color: #f3f4f6;">
          <h3 style="color: #1e3a8a; margin-top: 0;">Détails du constat:</h3>
          <p><strong>Véhicule A:</strong> ${reportDetails.vehicleA.brand} ${reportDetails.vehicleA.model} - ${reportDetails.vehicleA.licensePlate}</p>
          <p><strong>Véhicule B:</strong> ${reportDetails.vehicleB.brand} ${reportDetails.vehicleB.model} - ${reportDetails.vehicleB.licensePlate}</p>
        </div>
        
        <p style="color: #4b5563; line-height: 1.5;">
          Ce constat électronique a désormais une valeur juridique équivalente à un constat papier signé. 
          Il a été enregistré dans la base nationale des e-constats et transmis aux compagnies d'assurance concernées.
        </p>
        
        <p style="color: #4b5563; line-height: 1.5;">
          Conservez précieusement le numéro de référence mentionné ci-dessus pour toute communication 
          avec votre assureur concernant ce sinistre.
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">
            Email envoyé automatiquement le ${date} à ${time}.<br>
            © 2025 Constalib - Service e-constat officiel
          </p>
        </div>
      </div>
    `;
    
    // Send the email using the Resend API through Edge Function
    const { data: emailData, error: emailError } = await supabaseClient.functions.invoke('send-accident-report', {
      body: {
        to: [email],
        subject: `Confirmation e-Constat [${referenceId}] - Accident du ${reportDetails.date}`,
        html: htmlContent,
        text: `Confirmation de votre e-Constat. Référence: ${referenceId}. Conservez ce numéro pour vos démarches.`,
      },
    });
    
    if (emailError) {
      console.error("Error sending confirmation email:", emailError);
      throw new Error(`Failed to send confirmation email: ${emailError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Confirmation email sent successfully"
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-official-report-confirmation function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred sending the confirmation email"
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 500,
      }
    );
  }
});
