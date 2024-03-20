import { Pool } from "pg";
import { useRouter } from "next/router";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: getSSLValues(),
});

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "development" ? false : true;
}

async function fetchFromDatabase(materias) {
  const query = "SELECT * FROM perguntas WHERE materia = ANY($1::text[])";
  const values = [materias];
  const res = await pool.query(query, values);
  return res.rows;
}

export default function MinhaPagina({ dados }) {
  const router = useRouter();
  const { subjects } = router.query;

  return (
    <div>
      <div>
        <h1>ID da página: {subjects}</h1>
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
