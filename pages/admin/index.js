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
      </div>
      <Link href="/novapergunta">Criar Nova Pergunta</Link>
      {/* Tabela de perguntas existentes */}
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Enunciado</th>
            <th>Alternativa</th>
            <th>Alternativa</th>
            <th>Alternativa</th>
            <th>Resposta</th>
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
              {questao.outras_alternativas.map((alternativa, altIndex) => (
                <td key={`alt-${questao.id}-${altIndex}`}>{alternativa}</td>
              ))}
              <td key={`resposta-${questao.id}`}>{questao.resposta}</td>
              <td key={`materia-${questao.id}`}>{questao.materia}</td>
              <td key={`acoes-${questao.id}`}>
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
