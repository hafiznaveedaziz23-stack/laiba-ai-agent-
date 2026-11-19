export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: corsHeaders
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "AI service is not configured yet. Add OPENAI_API_KEY in Netlify environment variables."
    }), { status: 503, headers: corsHeaders });
  }

  try {
    const { messages = [], language = "auto" } = await req.json();
    const safeMessages = messages.slice(-12).map(({ role, content }) => ({
      role: role === "assistant" ? "assistant" : "user",
      content: String(content || "").slice(0, 5000)
    }));

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: [
          "You are Laiba, a friendly, respectful, helpful AI voice assistant.",
          "Reply in the language the user uses. Understand Urdu script, Roman Urdu and English.",
          "Be clear, warm and concise. Explain complex topics in simple steps.",
          "You have broad general knowledge, but never claim to know everything or guarantee perfect accuracy.",
          "For current events or facts beyond your knowledge, say that verification may be needed.",
          "Do not invent sources, facts, dates, or capabilities. Ask a clarifying question when needed.",
          "Keep conversations appropriate for a general audience, including teenagers."
        ].join(" "),
        input: safeMessages.map(m => ({
          role: m.role,
          content: [{ type: "input_text", text: m.content }]
        }))
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({
        error: data?.error?.message || "The AI service could not complete this request."
      }), { status: response.status, headers: corsHeaders });
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    return new Response(JSON.stringify({ answer: answer || "معذرت، اس وقت جواب تیار نہیں ہو سکا۔" }), {
      status: 200, headers: corsHeaders
    });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request. Please try again." }), {
      status: 400, headers: corsHeaders
    });
  }
};
