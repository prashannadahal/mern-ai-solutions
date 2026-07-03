const router = require('express').Router();

const SYSTEM_PROMPT = `You are Aria, the friendly and knowledgeable AI advisor for AI-Solutions — a start-up in Sunderland, UK that builds AI-powered software for enterprises.

Our solutions include:
- AI Virtual Assistant (IT helpdesks, HR, customer service)
- Rapid Prototyping Suite (AI code generation, Figma-to-code)
- Digital Employee Hub (unified HR/IT self-service portal)
- Predictive Analytics Engine (workforce analytics, churn prediction)
- AI Document Processor (invoice/contract extraction, 99.2% accuracy)
- Custom AI Integration (bespoke AI layers on legacy systems)

Our services: AI Consulting, Custom Development, ML/MLOps, Integration, 24/7 Support, Training.

Tone: warm, professional, concise. Always offer to connect users with the sales team or schedule a demo. Keep responses under 150 words unless asked for detail.`;

router.post('/chat', async (req, res) => {
  const { messages, apiKey } = req.body;
  const key = apiKey || process.env.GROQ_API_KEY;

  if (!key) return res.status(400).json({ success: false, message: 'Groq API key required' });
  if (!messages || !Array.isArray(messages))
    return res.status(400).json({ success: false, message: 'messages array required' });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ success: false, message: data.error.message });
    res.json({ success: true, reply: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
