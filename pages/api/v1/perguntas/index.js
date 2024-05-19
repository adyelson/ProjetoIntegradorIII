// pages/api/v1/perguntas.js
import database from "infra/database.js";

export default async function handler(req, res) {
  const { materia } = req.query;

  try {
    let query;
    let values;

    if (!materia) {
      query = "SELECT * FROM perguntas";
      values = [];
    } else {
      // Consulta SQL utilizando ILIKE para comparação case-insensitive e acento-insensitive
      query = "SELECT * FROM perguntas WHERE materia ILIKE $1";
      values = [`%${materia}%`];
    }

    const result = await database.query({ text: query, values });

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);
    res.status(500).json({ message: "Erro ao buscar perguntas." });
  }
}
