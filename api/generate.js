
export default async function handler(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt" });
  }

  // 1. Lancer génération
  let response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token r8_2RWmv85w8csJCtl6bPCLvs3ib5JV2Vb43T2zd",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl",
      input: { prompt }
    })
  });

  let prediction = await response.json();

  // 2. Vérifier si erreur directe
  if (!prediction.urls || !prediction.urls.get) {
    return res.status(500).json(prediction);
  }

  // 3. Polling (attente résultat)
  let output = null;

  for (let i = 0; i < 20; i++) {
    let check = await fetch(prediction.urls.get, {
      headers: {
        "Authorization": "Token r8_2RWmv85w8csJCtl6bPCLvs3ib5JV2Vb43T2zd"
      }
    });

    let data = await check.json();

    if (data.status === "succeeded") {
      output = data.output;
      break;
    }

    if (data.status === "failed") {
      return res.status(500).json({ error: "Generation failed" });
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  return res.status(200).json({
    image: output
  });
}
