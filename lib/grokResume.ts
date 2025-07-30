export async function askGrok(skills: string, experience: string) {
    const response = await fetch("https://api.grok.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Write a professional resume for someone with ${experience} experience in ${skills}.`,
      }),
    });
  
    const data = await response.json();
    return data.text; // Grok's AI-written resume!
  }