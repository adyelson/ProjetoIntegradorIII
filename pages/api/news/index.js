// pages/api/news.js
export default async function handler(req, res) {
  const apiKey = "5c4541699094496e93e040a7c9e7d050";
  const url = `https://newsapi.org/v2/everything?q=univesp&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    res.status(500).json({ error: "Erro ao buscar notícias" });
  }
}
