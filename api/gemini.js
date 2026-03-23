export default async function handler(req, res) {
  // 1. Get the question from the website
  const { prompt } = req.body;
  
  // 2. Access your key
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if Vercel is actually loading the key
  if (!apiKey) {
    console.error("CRITICAL: API Key is completely missing from Vercel environment.");
    return res.status(500).json({ error: "Server configuration error." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 3. Catch Google API errors (e.g., Invalid Key, Quota Exceeded)
    if (!response.ok) {
      console.error("Google API Error:", data.error.message);
      return res.status(response.status).json({ error: data.error.message });
    }

    // 4. Send the successful text answer back
    res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    
  } catch (error) {
    // 5. Catch network crashes or parsing errors
    console.error("Server Crash:", error.message);
    res.status(500).json({ error: "Failed to connect to AI engine." });
  }
}
