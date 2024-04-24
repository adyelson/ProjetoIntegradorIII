import { useState } from "react";
import database from "infra/database.js";
import Link from "next/link";

async function fetchFromDatabase() {
  try {
    const query = "SELECT * FROM perguntas";
    const res = await database.query(query);
    return res.rows;
  } catch (error) {
    console.error("Erro ao obter dados do banco de dados:", error);
    return [];
  }
}

export default function MinhaPagina({ perguntas }) {
  const [updatedPerguntas, setUpdatedPerguntas] = useState(perguntas);

  const handleExcluirPergunta = async (id) => {
    try {
      const res = await fetch(`/api/v1/removepergunta?id=${id}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        // Remova a pergunta da lista atualizada
        const updated = updatedPerguntas.filter(
          (pergunta) => pergunta.id !== id,
        );
        setUpdatedPerguntas(updated);
      } else {
        console.error("Erro ao excluir pergunta:", res.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir pergunta:", error);
    }
  };

  return (
    <div
      style={{
        margin: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <div
        style={{
          margin: "0px",
          backgroundColor: "darkred",
          width: "100%",
          color: "white",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          Sistema de provas para vestibular
        </h1>
        <div
          style={{
            width: "200px",
            marginTop: "10px",
            textAlign: "center",
            backgroundColor: "lightgray",
            borderRadius: "5px",
          }}
        >
          <Link href="/novapergunta">Criar Nova Pergunta</Link>
        </div>
      </div>
      {/* Tabela de perguntas existentes */}
      <table>
        <thead style={{ backgroundColor: "black", color: "white" }}>
          <tr>
            <th>Id</th>
            <th>Enunciado</th>
            <th>Alternativas</th>

            <th>Matéria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {updatedPerguntas.map((questao, index) => (
            <tr
              key={questao.id}
              style={{
                width: "100%",
                maxWidth: "600px",
                backgroundColor: index % 2 === 0 ? "lightgray" : "inherit",
              }}
            >
              <td key={`id-${questao.id}`} style={{ padding: "10px" }}>
                {questao.id}
              </td>
              <td key={`enunciado-${questao.id}`} style={{ padding: "10px" }}>
                {questao.enunciado}
              </td>
              <td style={{ padding: "5px" }}>
                {questao.outras_alternativas.map((alternativa, altIndex) => (
                  <p key={`alt-${questao.id}-${altIndex}`}>
                    {altIndex + 1 + ": " + alternativa}
                  </p>
                ))}
                <p key={`resposta-${questao.id}`}>
                  {"Resp: " + questao.resposta}
                </p>
              </td>
              <td key={`materia-${questao.id}`} style={{ padding: "5px" }}>
                {questao.materia}
              </td>
              <td key={`acoes-${questao.id}`} style={{ padding: "5px" }}>
                <Link href={`/novapergunta?id=${questao.id}`}>Editar</Link>
                <br></br>
                {/* Adicione o evento de clique para chamar a função de exclusão */}
                <a href="#" onClick={() => handleExcluirPergunta(questao.id)}>
                  Excluir
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps(context) {
  const perguntas = await fetchFromDatabase();
  return { props: { perguntas } };
}
