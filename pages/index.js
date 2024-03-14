import { Pool } from "pg";

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
async function fetchFromDatabase() {
  const res = await pool.query("SELECT * FROM perguntas");
  return res.rows;
}

// export default function MinhaPagina({ dados }) {
//   // Renderize seus dados aqui
//   return <div>{JSON.stringify(dados)}</div>;
// }
export default function MinhaPagina({ dados }) {
  return (
    <div>
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

export async function getServerSideProps() {
  const dados = await fetchFromDatabase();
  return { props: { dados } };
}
