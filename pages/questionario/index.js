import { useRouter } from "next/router";
import database from "infra/database.js";

async function fetchFromDatabase(materias) {
  const query = "SELECT * FROM perguntas WHERE materia = ANY($1::text[])";
  const values = [materias];
  const res = await database.query({ text: query, values });
  return res.rows;
}

export default function MinhaPagina({ dados }) {
  const router = useRouter();
  const { subjects } = router.query;

  return (
    <div>
      <div>
        <h1>Matérias: {subjects}</h1>
      </div>
      {dados.map((questao) => (
        <div key={questao.id}>
          <h2>{questao.enunciado}</h2>
          <p>Resposta correta: {questao.resposta}</p>
          <p>Outras alternativas: {questao.outras_alternativas.join(", ")}</p>
          <p>Matéria: {questao.materia}</p>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { subjects } = context.query;
  const materias = subjects.split(","); // Transforma a string separada por vírgula em um array
  const dados = await fetchFromDatabase(materias);
  return { props: { dados } };
}
