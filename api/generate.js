export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt" });
  }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token TA_CLE_REPLICATE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl",
      input: {
        prompt: prompt
      }
    })
  });

  const data = await response.json();

  return res.status(200).json(data);
}
