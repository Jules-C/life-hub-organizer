import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// Environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SMTP_HOST = Deno.env.get("SMTP_HOST") ?? "";
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") ?? "587");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME") ?? "";
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD") ?? "";
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "http://localhost:3000";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "noreply@example.com";

serve(async (req) => {
  try {
    // Parse request body
    const { email, familyId, familyName, token, invitedBy } = await req.json();
    
    // Validate inputs
    if (!email || !familyId || !token || !invitedBy) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Create a Supabase client with the internal admin key
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get inviter info
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(invitedBy);
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      return new Response(
        JSON.stringify({ error: "Error fetching user data" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Extract first name from user metadata or use fallback
    const userMetadata = userData?.user?.user_metadata;
    const inviterName = userMetadata?.first_name || userMetadata?.name || "Someone";
    
    // Create invite URL
    const inviteUrl = `${FRONTEND_URL}/register?invitation=${token}`;
    
    // Set up email client
    const client = new SmtpClient();
    
    // Connect to SMTP server
    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    });
    
    // Send email
    await client.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${inviterName} has invited you to join ${familyName || "their family"} on LifeHubOrganizer`,
      content: `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">You've been invited!</h2>
          <p>Hi there,</p>
          <p><strong>${inviterName}</strong> has invited you to join their family, <strong>${familyName || "their family"}</strong>, on LifeHubOrganizer.</p>
          <p>LifeHubOrganizer helps families organize events, documents, and health information in one place.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          <p>This invitation will expire in 7 days.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">LifeHubOrganizer - Organize your family's life in one place</p>
        </div>
      </body>
      </html>
      `,
      html: true,
    });
    
    // Close connection
    await client.close();
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Invitation email sent to ${email}`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error processing invitation email:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred while sending the invitation",
        stack: Deno.env.get("ENVIRONMENT") === "development" ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
});