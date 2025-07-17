// index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  const body = await req.json();
  console.log("OCR received:", body);

  return new Response(JSON.stringify({
    message: "Got it!",
    received: body
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
