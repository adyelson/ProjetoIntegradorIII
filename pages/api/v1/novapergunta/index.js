import database from "infra/database";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Criação de nova pergunta
    try {
      const { enunciado, resposta, outrasAlternativas, materia } = req.body;
      const outrasAlternativasTrimmed = outrasAlternativas.slice(0, 3);
      // Valide os dados recebidos aqui, se necessário

      const queryObject = {
        text: "INSERT INTO perguntas (enunciado, resposta, outras_alternativas, materia) VALUES ($1, $2, $3, $4) RETURNING id",
        values: [enunciado, resposta, outrasAlternativasTrimmed, materia],
      };

      const result = await database.query(queryObject);

      const newQuestionId = result.rows[0].id;

      res
        .status(201)
        .json({ message: "Pergunta criada com sucesso", id: newQuestionId });
    } catch (error) {
      console.error("Erro ao criar pergunta:", error);
      res.status(500).json({ message: "Erro ao processar a requisição" });
    }
  } else if (req.method === "PUT") {
    // Atualização de pergunta existente
    try {
      const { id, enunciado, resposta, outrasAlternativas, materia } = req.body;
      const outrasAlternativasTrimmed = outrasAlternativas.slice(0, 3);
      // Valide os dados recebidos aqui, se necessário

      const queryObject = {
        text: "UPDATE perguntas SET enunciado = $1, resposta = $2, outras_alternativas = $3, materia = $4 WHERE id = $5",
        values: [enunciado, resposta, outrasAlternativasTrimmed, materia, id],
      };

      await database.query(queryObject);

      res.status(200).json({ message: "Pergunta atualizada com sucesso", id });
    } catch (error) {
      console.error("Erro ao atualizar pergunta:", error);
      res.status(500).json({ message: "Erro ao processar a requisição" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
