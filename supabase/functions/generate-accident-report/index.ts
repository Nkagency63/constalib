
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateReportRequest {
  reportId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reportId }: GenerateReportRequest = await req.json();

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the report data
    const { data: reportData, error: reportError } = await supabaseAdmin
      .from('accident_reports')
      .select(`
        *,
        vehicles!accident_reports_vehicle_id_fkey(*),
        other_vehicle:vehicles!accident_reports_other_vehicle_id_fkey(*)
      `)
      .eq('id', reportId)
      .single();

    if (reportError) {
      console.error('Error fetching report:', reportError);
      throw new Error('Failed to fetch report data');
    }

    // For now, just update the signature status without actually generating the PDF
    // TODO: Implement actual PDF generation using a PDF library
    const { error: updateError } = await supabaseAdmin
      .from('accident_report_signatures')
      .update({
        pdf_generated: true,
        pdf_url: `https://example.com/reports/${reportId}.pdf`, // Placeholder URL
        updated_at: new Date().toISOString()
      })
      .eq('report_id', reportId);

    if (updateError) {
      console.error('Error updating signature status:', updateError);
      throw new Error('Failed to update signature status');
    }

    return new Response(
      JSON.stringify({ message: 'PDF generation initiated' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in generate-accident-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);

