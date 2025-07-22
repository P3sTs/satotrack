
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating to free plan");
      
      // Update profiles table
      await supabaseClient.from("profiles").upsert({
        id: user.id,
        premium_status: 'inactive',
        premium_expiry: null,
      }, { onConflict: 'id' });

      // Update user_plans table - com melhor tratamento de erro
      const { error: userPlanError } = await supabaseClient
        .from("user_plans")
        .upsert({
          user_id: user.id,
          plan_type: 'free',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      
      if (userPlanError) {
        console.error('Error updating user_plans:', userPlanError);
      }
      
      return new Response(JSON.stringify({ subscribed: false, plan_type: 'free' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
    } else {
      logStep("No active subscription found");
    }

    // Update profiles table
    await supabaseClient.from("profiles").upsert({
      id: user.id,
      premium_status: hasActiveSub ? 'active' : 'inactive',
      premium_expiry: subscriptionEnd,
    }, { onConflict: 'id' });

    // Update user_plans table - com tratamento de erro aprimorado
    const { error: userPlanUpdateError } = await supabaseClient
      .from("user_plans")
      .upsert({
        user_id: user.id,
        plan_type: hasActiveSub ? 'premium' : 'free',
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });
    
    if (userPlanUpdateError) {
      console.error('Error updating user_plans in subscription check:', userPlanUpdateError);
      // Não falhar a requisição por causa deste erro
    }

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, plan_type: hasActiveSub ? 'premium' : 'free' });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      plan_type: hasActiveSub ? 'premium' : 'free',
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
