
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  user_id: string;
  summary_type: "daily" | "weekly";
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const { user_id, summary_type } = await req.json() as RequestBody;
    
    // Get user information
    const { data: user, error: userError } = await supabase
      .from("auth.users")
      .select("email")
      .eq("id", user_id)
      .single();

    if (userError) {
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (!user?.email) {
      throw new Error("User email not found");
    }

    // Get user's wallets
    const { data: wallets, error: walletsError } = await supabase
      .from("bitcoin_wallets")
      .select("*")
      .eq("user_id", user_id);

    if (walletsError) {
      throw new Error(`Error fetching wallets: ${walletsError.message}`);
    }

    // Prepare the email summary
    // In a real application, you would use a proper email service like SendGrid, Mailgun, etc.
    // For now, we'll just log the email content
    const summaryTitle = summary_type === "daily" ? "Resumo Diário" : "Resumo Semanal";
    
    let emailContent = `
      <h1>${summaryTitle} - SatoTrack</h1>
      <p>Olá,</p>
      <p>Aqui está o seu ${summary_type === "daily" ? "resumo diário" : "resumo semanal"} do SatoTrack:</p>
    `;

    if (wallets && wallets.length > 0) {
      emailContent += `
        <h2>Suas Carteiras:</h2>
        <ul>
      `;
      
      wallets.forEach(wallet => {
        emailContent += `
          <li>
            <strong>${wallet.name}</strong><br>
            Endereço: ${wallet.address}<br>
            Saldo: ${wallet.balance} BTC<br>
            Última atualização: ${new Date(wallet.last_updated).toLocaleString()}
          </li>
        `;
      });
      
      emailContent += '</ul>';
    } else {
      emailContent += '<p>Você ainda não tem carteiras registradas.</p>';
    }

    emailContent += `
      <p>Para mais detalhes, acesse seu <a href="${supabaseUrl}">Dashboard SatoTrack</a>.</p>
      <p>Atenciosamente,<br>Equipe SatoTrack</p>
    `;

    console.log(`Email summary prepared for ${user.email}:`);
    console.log(emailContent);

    // In a real application, you would send the email here
    // For now, we'll just log it and add a record to notification_logs
    await supabase
      .from("notification_logs")
      .insert({
        user_id,
        notification_type: `${summary_type}_summary`,
        status: "simulated", // In a real app, you'd use "sent" or "failed"
        details: {
          email: user.email,
          subject: summaryTitle,
          wallets_count: wallets?.length || 0,
          timestamp: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email summary would be sent to ${user.email}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error preparing email summary:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
