
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { email, referenceId, reportData, vehicleA, vehicleB } = await req.json();

    if (!email || !referenceId) {
      throw new Error("Email and reference ID are required");
    }

    console.log(`Sending official report confirmation to ${email} for reference ${referenceId}`);

    // Format the date properly for the email
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    // Create the email content
    const emailResponse = await resend.emails.send({
      from: "ConstaLib <noreply@constalib.fr>",
      to: [email],
      subject: `Confirmation de votre constat amiable - Réf: ${referenceId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a;">Confirmation d'Enregistrement</h1>
            <p style="font-size: 16px; color: #666;">Constat Amiable d'Accident de la Route</p>
          </div>
          
          <div style="background-color: #f5f7ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0;">Référence unique: <strong>${referenceId}</strong></p>
            <p style="margin: 5px 0;">Date et heure d'enregistrement: <strong>${formattedDate}</strong></p>
          </div>
          
          <p>Bonjour,</p>
          
          <p>Nous vous confirmons que votre constat amiable d'accident a été enregistré avec succès dans notre système. Ce document a désormais une valeur juridique et peut être communiqué à votre assurance.</p>
          
          <h3 style="color: #1e3a8a; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Détails de l'accident</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Date:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${reportData.date || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Heure:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${reportData.time || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Lieu:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${reportData.location || 'Non spécifié'}</td>
            </tr>
          </table>
          
          <h3 style="color: #1e3a8a; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px;">Véhicules impliqués</h3>
          
          <div style="margin-bottom: 15px;">
            <h4 style="margin-bottom: 5px;">Véhicule A:</h4>
            <p style="margin: 3px 0;">Marque/Modèle: <strong>${vehicleA.brand || ''} ${vehicleA.model || ''}</strong></p>
            <p style="margin: 3px 0;">Immatriculation: <strong>${vehicleA.licensePlate || 'Non spécifié'}</strong></p>
            <p style="margin: 3px 0;">Assurance: <strong>${vehicleA.insuranceCompany || 'Non spécifiée'}</strong></p>
            <p style="margin: 3px 0;">N° de police: <strong>${vehicleA.insurancePolicy || 'Non spécifié'}</strong></p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 5px;">Véhicule B:</h4>
            <p style="margin: 3px 0;">Marque/Modèle: <strong>${vehicleB.brand || ''} ${vehicleB.model || ''}</strong></p>
            <p style="margin: 3px 0;">Immatriculation: <strong>${vehicleB.licensePlate || 'Non spécifié'}</strong></p>
            <p style="margin: 3px 0;">Assurance: <strong>${vehicleB.insuranceCompany || 'Non spécifiée'}</strong></p>
            <p style="margin: 3px 0;">N° de police: <strong>${vehicleB.insurancePolicy || 'Non spécifié'}</strong></p>
          </div>
          
          <p style="border-top: 1px solid #e0e0e0; margin-top: 20px; padding-top: 15px;">Ce document électronique est certifié et horodaté. Conservez cette confirmation qui pourra être demandée par votre assureur.</p>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
            <p>© ${new Date().getFullYear()} ConstaLib - Tous droits réservés</p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.id,
        message: "Confirmation email sent successfully" 
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-official-report-confirmation function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while sending confirmation" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
