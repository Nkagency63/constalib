
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Configure Resend for email sending
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportConfirmationRequest {
  email: string;
  referenceId: string;
  reportDetails: {
    date: string;
    time: string;
    location: string;
    vehicleA: {
      brand: string;
      model: string;
      licensePlate: string;
    };
    vehicleB: {
      brand: string;
      model: string;
      licensePlate: string;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { email, referenceId, reportDetails }: ReportConfirmationRequest = await req.json();
    
    // Log information
    console.log(`Sending official report confirmation to ${email} for report ${referenceId}`);
    
    // Format date for email
    const formattedDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "Constalib <ne-pas-repondre@constalib.fr>",
      to: [email],
      subject: `Confirmation d'enregistrement officiel - Référence ${referenceId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #f0f6ff; padding: 20px; border-radius: 8px;">
            <h1 style="color: #1e40af; margin-top: 0;">Confirmation d'enregistrement officiel</h1>
            <p>Votre constat amiable a été enregistré officiellement le ${formattedDate}.</p>
            
            <div style="background-color: #fff; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="font-weight: bold; margin-top: 0;">Référence: ${referenceId}</p>
              <p style="margin: 5px 0;">Date de l'accident: ${reportDetails.date} à ${reportDetails.time}</p>
              <p style="margin: 5px 0;">Lieu: ${reportDetails.location}</p>
            </div>
            
            <h2 style="color: #1e40af; font-size: 18px;">Véhicules impliqués:</h2>
            
            <div style="margin-bottom: 15px;">
              <h3 style="font-size: 16px; margin-bottom: 5px;">Véhicule A:</h3>
              <p style="margin: 3px 0;">Marque/Modèle: ${reportDetails.vehicleA.brand} ${reportDetails.vehicleA.model}</p>
              <p style="margin: 3px 0;">Immatriculation: ${reportDetails.vehicleA.licensePlate}</p>
            </div>
            
            <div>
              <h3 style="font-size: 16px; margin-bottom: 5px;">Véhicule B:</h3>
              <p style="margin: 3px 0;">Marque/Modèle: ${reportDetails.vehicleB.brand} ${reportDetails.vehicleB.model}</p>
              <p style="margin: 3px 0;">Immatriculation: ${reportDetails.vehicleB.licensePlate}</p>
            </div>
            
            <p style="margin-top: 30px;">Votre constat a été transmis aux services concernés et sera traité dans les meilleurs délais.</p>
            
            <p style="color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 30px;">
              Ce message est généré automatiquement. Merci de ne pas y répondre.
              Pour toute question concernant votre constat, munissez-vous de votre numéro de référence et contactez votre assureur.
            </p>
          </div>
        </div>
      `
    });
    
    console.log("Email confirmation sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        messageId: emailResponse.id
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
    console.error("Error sending confirmation email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred while sending confirmation email"
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
