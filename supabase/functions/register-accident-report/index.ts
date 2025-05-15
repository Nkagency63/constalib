
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Supabase client
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  {
    global: { headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` } },
    auth: { persistSession: false }
  }
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { reportData, vehicleA, vehicleB, circumstances, geolocation, signatureData } = await req.json();

    console.log("Registering accident report with data:", { reportData, vehicleA, vehicleB });

    // Generate a unique official reference ID
    const referenceId = generateReferenceId();
    
    // Timestamp for report creation
    const timestamp = new Date().toISOString();
    
    // Store the accident report in the database with official status
    const { data, error } = await supabaseClient
      .from("accident_reports")
      .insert({
        date: reportData.date,
        time: reportData.time,
        location: reportData.location,
        description: reportData.description || "",
        geolocation_lat: geolocation?.lat || null,
        geolocation_lng: geolocation?.lng || null,
        geolocation_address: geolocation?.address || "",
        official_reference: referenceId,
        official_status: "registered",
        registration_timestamp: timestamp
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving accident report:", error);
      throw new Error(`Failed to register accident report: ${error.message}`);
    }

    // Store the signatures if provided
    if (signatureData && data?.id) {
      const { error: signatureError } = await supabaseClient
        .from("accident_report_signatures")
        .insert({
          report_id: data.id,
          party_a_signature: signatureData.partyA,
          party_b_signature: signatureData.partyB,
          party_a_signed_at: timestamp,
          party_b_signed_at: timestamp,
          pdf_generated: true
        });

      if (signatureError) {
        console.error("Error storing signatures:", signatureError);
      }
    }

    // Send confirmation email if personal email is provided
    if (reportData.personalEmail) {
      try {
        await supabaseClient.functions.invoke("send-official-report-confirmation", {
          body: {
            email: reportData.personalEmail,
            referenceId,
            reportData,
            vehicleA,
            vehicleB
          }
        });
        console.log("Confirmation email sent to:", reportData.personalEmail);
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't fail the whole process if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        referenceId,
        message: "Accident report registered successfully" 
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in register-accident-report function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred during registration" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

// Generate a unique reference ID for the accident report
function generateReferenceId(): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CR-${timestamp}-${randomChars}`;
}
