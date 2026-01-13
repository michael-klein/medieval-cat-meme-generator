export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Handle /translate endpoint
    if (url.pathname === "/translate" && request.method === "GET") {
      try {
        const text = url.searchParams.get("text");

        if (!text) {
          return new Response(
            JSON.stringify({ error: "Text parameter is required" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }

        // Create a cache key from the text
        const cacheKey = `translation:${text}`;

        // Check KV cache first
        const cachedTranslation = await env.KV?.get(cacheKey);

        if (cachedTranslation) {
          return new Response(
            JSON.stringify({ translated: cachedTranslation }),
            {
              headers: {
                "Content-Type": "application/json",
                "X-Cache": "HIT",
                ...corsHeaders,
              },
            }
          );
        }

        // Call the Shakespeare translation API
        const translationResponse = await fetch(
          `https://api.funtranslations.com/translate/shakespeare.json?text=${encodeURIComponent(
            text
          )}`
        );

        if (!translationResponse.ok) {
          return new Response(
            JSON.stringify({ error: "Translation API error" }),
            {
              status: translationResponse.status,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            }
          );
        }

        const translationData = (await translationResponse.json()) as {
          contents: {
            translated: string;
            text: string;
            translation: string;
          };
        };

        const translated = translationData.contents.translated;

        // Cache the translation in KV (with no expiration)
        await env.KV?.put(cacheKey, translated);

        return new Response(JSON.stringify({ translated }), {
          headers: {
            "Content-Type": "application/json",
            "X-Cache": "MISS",
            ...corsHeaders,
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to translate text" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    }

    // Default 404 response
    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders,
    });
  },
} satisfies ExportedHandler<Env>;

interface Env {
  KV?: KVNamespace;
}
