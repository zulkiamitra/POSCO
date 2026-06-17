const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL || "https://hdsmpfqvhhlaiadvqift.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

// We use the service client to inspect, but to login we want to use the standard client (anon key)
// Wait, we can create a client and just attempt signInWithPassword.
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testLogin(email, password) {
  console.log(`Testing login for ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(`Login failed for ${email}:`, error.message);
  } else {
    console.log(`Login successful for ${email}! User ID: ${data.user.id}`);
  }
}

async function run() {
  await testLogin("admin@posco.id", "admin123");
  await testLogin("verifikator@posco.id", "verifikator123");
}

run();
