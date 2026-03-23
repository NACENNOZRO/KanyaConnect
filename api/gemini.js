export default async function handler(req, res) {
  // 1. Get the question from the website
  const { prompt } = req.body;
  
  // 2. Access your key (hidden in the Hosting Dashboard)
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    // 3. Send only the text answer back to the project
    res.status(200).json({ text: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to AI" });
  }
}