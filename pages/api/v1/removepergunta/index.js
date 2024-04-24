import database from "infra/database";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "ID da pergunta é obrigatório" });
    }

    const queryObject = {
      text: "DELETE FROM perguntas WHERE id = $1",
      values: [id],
    };

    await database.query(queryObject);

    res.status(200).json({ message: "Pergunta deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pergunta:", error);
    res.status(500).json({ message: "Erro ao processar a requisição" });
  }
}
