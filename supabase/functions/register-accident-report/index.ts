
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
    const requestData = await req.json();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    // Log the request for debugging
    console.log("Registering official accident report:", JSON.stringify(requestData));
    
    // Generate a unique reference ID for the report
    const referenceId = `ECO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Format data for the accident report registry
    const formattedReportData = {
      reference_id: referenceId,
      date: requestData.reportData.date,
      time: requestData.reportData.time,
      location: requestData.reportData.location,
      geolocation_lat: requestData.geolocation?.lat,
      geolocation_lng: requestData.geolocation?.lng,
      vehicle_a_plate: requestData.vehicleA.licensePlate,
      vehicle_a_brand: requestData.vehicleA.brand,
      vehicle_a_model: requestData.vehicleA.model,
      vehicle_a_insurance: requestData.vehicleA.insuranceCompany,
      vehicle_a_policy: requestData.vehicleA.insurancePolicy,
      vehicle_b_plate: requestData.vehicleB.licensePlate, 
      vehicle_b_brand: requestData.vehicleB.brand,
      vehicle_b_model: requestData.vehicleB.model,
      vehicle_b_insurance: requestData.vehicleB.insuranceCompany,
      vehicle_b_policy: requestData.vehicleB.insurancePolicy,
      circumstances_a: JSON.stringify(requestData.circumstances.vehicleA),
      circumstances_b: JSON.stringify(requestData.circumstances.vehicleB),
      registered_at: new Date().toISOString(),
      status: 'pending',
    };
    
    // Save the official report to the database
    const { data, error } = await supabaseClient
      .from('official_accident_reports')
      .insert(formattedReportData)
      .select()
      .single();
      
    if (error) {
      console.error("Error saving official report:", error);
      throw new Error(`Error saving official report: ${error.message}`);
    }

    // If we have a personal email, send a confirmation email
    if (requestData.reportData.personalEmail) {
      try {
        await supabaseClient.functions.invoke('send-official-report-confirmation', {
          body: {
            email: requestData.reportData.personalEmail,
            referenceId: referenceId,
            reportDetails: {
              date: requestData.reportData.date,
              time: requestData.reportData.time,
              location: requestData.reportData.location,
              vehicleA: requestData.vehicleA,
              vehicleB: requestData.vehicleB
            }
          }
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Continue execution, as this is non-critical
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        referenceId: referenceId,
        message: "Accident report officially registered"
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
    console.error("Error in register-accident-report function:", error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred during official registration"
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
