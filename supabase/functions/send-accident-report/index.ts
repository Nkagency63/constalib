
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string[];
  subject: string;
  reportId: string;
  reportData: any;
  vehicleInfo: string;
  otherVehicleInfo: string;
  date: string;
  time: string;
  location: string;
  description: string;
  hasPhotos: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "Server configuration error: RESEND_API_KEY not set" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    const { to, subject, reportId, reportData, vehicleInfo, otherVehicleInfo, date, time, location, description, hasPhotos } = await req.json() as EmailRequest;

    if (!to || !to.length || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Format the email HTML
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #0056b3; }
            .info-section { background-color: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            .info-title { font-weight: bold; margin-bottom: 5px; }
            .cta-button { display: inline-block; background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Constat Amiable d'Accident Automobile</h1>
            <p>Voici les détails du constat amiable référencé <strong>${reportId}</strong>.</p>
            
            <div class="info-section">
              <div class="info-title">Date et Heure:</div>
              <p>${date} à ${time}</p>
              
              <div class="info-title">Lieu:</div>
              <p>${location}</p>
              
              <div class="info-title">Description:</div>
              <p>${description || "Aucune description fournie"}</p>
            </div>
            
            <div class="info-section">
              <div class="info-title">Véhicule A:</div>
              <p>${vehicleInfo}</p>
            </div>
            
            <div class="info-section">
              <div class="info-title">Véhicule B:</div>
              <p>${otherVehicleInfo}</p>
            </div>
            
            ${hasPhotos ? `<p>Des photos ont été prises et sont disponibles dans le système Constalib.</p>` : 
            `<p>Aucune photo n'a été jointe à ce constat.</p>`}
            
            <p>Cette déclaration a été générée par le système Constalib.fr.</p>
          </div>
        </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: "Constalib <noreply@constalib.fr>",
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
