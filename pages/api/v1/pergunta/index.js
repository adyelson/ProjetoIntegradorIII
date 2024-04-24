// pages/api/v1/pergunta.js
import database from "infra/database.js";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID da pergunta não fornecido." });
  }

  try {
    const query = {
      text: "SELECT * FROM perguntas WHERE id = $1",
      values: [id],
    };
    const result = await database.query(query);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Pergunta não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao buscar pergunta:", error);
    res.status(500).json({ message: "Erro ao buscar pergunta." });
  }
}
