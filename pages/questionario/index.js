import { useState } from "react";
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
  const [respostas, setRespostas] = useState({}); // Estado para armazenar as respostas dos alunos
  const [provaFinalizada, setProvaFinalizada] = useState(false); // Estado para verificar se a prova foi finalizada
  const [pontuacao, setPontuacao] = useState(0); // Estado para armazenar a pontuação do aluno

  const handleResposta = (id, resposta) => {
    setRespostas({ ...respostas, [id]: resposta });
  };

  const finalizarProva = () => {
    setProvaFinalizada(true);
    let pontuacaoAtual = 0;
    dados.forEach((questao) => {
      if (respostas[questao.id] === questao.resposta) {
        pontuacaoAtual++;
      }
    });
    setPontuacao(pontuacaoAtual);
    // Lógica para exibir a pontuação ou processar as respostas de outra forma
  };

  return (
    <div>
      <div>
        <h1>Vestibular</h1>
      </div>
      {dados.map((questao) => (
        <div key={questao.id}>
          <h2>{questao.enunciado}</h2>
          <ul>
            {questao.outras_alternativas.map((alt, index) => (
              <li key={index}>
                <input
                  type="radio"
                  id={`questao${questao.id}-alt${index}`}
                  name={`questao${questao.id}`}
                  value={alt}
                  onChange={() => handleResposta(questao.id, alt)}
                />
                <label htmlFor={`questao${questao.id}-alt${index}`}>
                  {alt}
                </label>
              </li>
            ))}
            <li>
              <input
                type="radio"
                id={`questao${questao.id}-resposta`}
                name={`questao${questao.id}`}
                value={questao.resposta}
                onChange={() => handleResposta(questao.id, questao.resposta)}
              />
              <label htmlFor={`questao${questao.id}-resposta`}>
                {questao.resposta}
              </label>
            </li>
          </ul>
        </div>
      ))}
      {!provaFinalizada && (
        <button onClick={finalizarProva}>Finalizar Prova</button>
      )}
      {provaFinalizada && (
        <div>
          <h3>Pontuação: {pontuacao}</h3>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { subjects } = context.query;
  const materias = subjects.split(","); // Transforma a string separada por vírgula em um array
  const dados = await fetchFromDatabase(materias);
  console.log(dados);
  return { props: { dados } };
}
