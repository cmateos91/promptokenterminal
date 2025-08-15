// Dynamic NYX dialogue using OpenAI's Chat Completions API
// Requires the user to set VITE_OPENAI_API_KEY in the environment

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function nyxResponder(userMessage) {
  if (!apiKey) {
    return 'NYX channel offline: set VITE_OPENAI_API_KEY to enable responses.';
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres NYX, un asistente virtual con personalidad rebelde y estilo ciberpunk. Responde de forma coherente y evocadora, pero no cambies la trama ni reveles pistas de los puzzles.'
          },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.9
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || 'NYX emite ruido incomprensible.';
  } catch (e) {
    return 'NYX connection error.';
  }
}
