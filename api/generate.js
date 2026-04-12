export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt" });
  }

  // 1. Lancer génération
  let response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token r8_IXf**********************************",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl",
      input: { prompt }
    })
  });

  let prediction = await response.json();

  // 2. Attendre résultat
  let url = prediction.urls.get;

  let output;

  for (let i = 0; i < 10; i++) {
    let check = await fetch(url, {
      headers: {
        "Authorization": "Token r8_IXf**********************************"
      }
    });

    let result = await check.json();

    if (result.status === "succeeded") {
      output = result.output;
      break;
    }

    if (result.status === "failed") {
      return res.status(500).json({ error: "Generation failed" });
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  res.status(200).json({ image: output });
}
