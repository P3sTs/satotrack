
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get the Telegram bot token from environment variables
const TELEGRAM_BOT_TOKEN = Deno.env.get("7826526912:AAG-7hTgiBjGc_kWG7ev4ik96RmRnBORwesKf7yZPrpn7XsIuXVX9Ft1CN7oHUmrqszRKTl1jlERewYvWzWwhpQ8KBPaTwNWdFD");

interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: string;
}

interface RequestBody {
  user_id: string;
  message: string;
  notification_type: string;
  details?: any;
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable not set");
    }

    // Get request body
    const { user_id, message, notification_type, details } = await req.json() as RequestBody;

    // Get the Supabase client to interact with the database
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Create Supabase client using runtime API key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Get user's Telegram chat ID from user_settings
    const { data: userSettings, error: settingsError } = await supabaseClient
      .from("user_settings")
      .select("telegram_chat_id, telegram_notifications_enabled")
      .eq("user_id", user_id)
      .single();

    if (settingsError) {
      throw new Error(`Error fetching user settings: ${settingsError.message}`);
    }

    if (!userSettings?.telegram_chat_id || !userSettings.telegram_notifications_enabled) {
      // Log that notification was not sent due to missing chat ID or disabled notifications
      await supabaseClient.from("notification_logs").insert({
        user_id,
        notification_type,
        status: "skipped",
        details: {
          message,
          reason: !userSettings.telegram_notifications_enabled 
            ? "Telegram notifications disabled" 
            : "Missing Telegram chat ID"
        }
      });

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Telegram notifications disabled or chat ID not set" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Send message to Telegram
    const telegramMessage: TelegramMessage = {
      chat_id: userSettings.telegram_chat_id,
      text: `🔔 *SatoTrack* 🔔\n\n${message}`,
      parse_mode: "Markdown",
    };

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramMessage),
      }
    );

    const telegramData = await telegramResponse.json();

    // Log the notification in the database
    await supabaseClient.from("notification_logs").insert({
      user_id,
      notification_type,
      status: telegramData.ok ? "sent" : "failed",
      details: {
        message,
        ...details,
        telegram_response: telegramData
      }
    });

    return new Response(
      JSON.stringify({ success: telegramData.ok, data: telegramData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: telegramData.ok ? 200 : 400,
      }
    );
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Helper function to create Supabase client
function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: () => fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&limit=1`, {
            headers: {
              "apikey": supabaseKey,
              "Authorization": `Bearer ${supabaseKey}`
            }
          }).then(res => res.json()).then(data => ({ data: data[0], error: null }))
        })
      }),
      insert: (data: any) => fetch(`${supabaseUrl}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(data)
      }).then(() => ({ error: null }))
    })
  };
}
