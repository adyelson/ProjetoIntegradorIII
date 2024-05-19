import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import database from "infra/database.js";

async function fetchFromDatabase(materias, questionCount) {
  const query = `
    SELECT * FROM perguntas 
    WHERE materia = ANY($1::text[]) 
    ORDER BY random() 
    LIMIT $2`;
  const values = [materias, questionCount];
  const res = await database.query({ text: query, values });
  return res.rows;
}

export default function MinhaPagina({ dados }) {
  const router = useRouter();
  const { subjects, questionCount } = router.query;
  const [respostas, setRespostas] = useState({});
  const [provaFinalizada, setProvaFinalizada] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [alternativasEmbaralhadas, setAlternativasEmbaralhadas] = useState([]);
  const [timer, setTimer] = useState(0);
  const [tempoFinalizacao, setTempoFinalizacao] = useState(0);
  const [errosPorMateria, setErrosPorMateria] = useState({});
  const timerRef = useRef(null);

  useEffect(() => {
    embaralharAlternativas();

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [dados]);

  const embaralharAlternativas = () => {
    dados.forEach((questao) => {
      const alternativas = questao.outras_alternativas.concat(questao.resposta);
      const alternativasEmbaralhadas = alternativas.sort(
        () => Math.random() - 0.5,
      );
      setAlternativasEmbaralhadas((prevAlternativas) => ({
        ...prevAlternativas,
        [questao.id]: alternativasEmbaralhadas,
      }));
    });
  };

  const handleResposta = (id, resposta) => {
    setRespostas({ ...respostas, [id]: resposta });
  };

  const finalizarProva = () => {
    setProvaFinalizada(true);
    let pontuacaoAtual = 0;
    let errosPorMateriaAtual = {};

    dados.forEach((questao) => {
      const respostaCorreta = respostas[questao.id] === questao.resposta;
      if (respostaCorreta) {
        pontuacaoAtual++;
      } else {
        const materia = questao.materia;
        errosPorMateriaAtual[materia] =
          (errosPorMateriaAtual[materia] || 0) + 1;
      }
    });

    setPontuacao(pontuacaoAtual);
    setErrosPorMateria(errosPorMateriaAtual);
    clearInterval(timerRef.current);
    setTempoFinalizacao(timer);
  };

  const letrasAlternativas = ["A", "B", "C", "D", "E"];

  return (
    <main>
      <div
        style={{
          margin: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <header
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
          <p style={{ textAlign: "center" }}>
            Tempo decorrido: {Math.floor(timer / 60)}:
            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </p>
        </header>

        {dados.map((questao, index) => (
          <section
            style={{ width: "100%", maxWidth: "600px" }}
            key={questao.id}
          >
            <h2 tabIndex={0}>
              Pergunta {index + 1}: {questao.enunciado}
            </h2>
            {alternativasEmbaralhadas[questao.id] &&
              alternativasEmbaralhadas[questao.id].map((alt, altIndex) => {
                const isCorrect = provaFinalizada && alt === questao.resposta;
                const isIncorrect =
                  provaFinalizada &&
                  alt === respostas[questao.id] &&
                  alt !== questao.resposta;
                const isMarked = respostas[questao.id] === alt;

                let ariaLabel = letrasAlternativas[altIndex] + ": " + alt;
                if (isMarked) {
                  ariaLabel += " (alternativa marcada)";
                } else {
                  ariaLabel += " (alternativa não marcada)";
                }
                if (isIncorrect && provaFinalizada) {
                  ariaLabel += " (alternativa errada)";
                }
                if (isCorrect && provaFinalizada) {
                  ariaLabel += " (alternativa certa)";
                }
                return (
                  <div
                    key={altIndex}
                    style={{ marginBottom: "10px", display: "flex" }}
                  >
                    <input
                      type="radio"
                      id={`questao${questao.id}-alt${altIndex}`}
                      name={`questao${questao.id}`}
                      value={alt}
                      onChange={() => handleResposta(questao.id, alt)}
                      disabled={provaFinalizada}
                      style={{ display: "none" }}
                      aria-checked={isMarked}
                    />
                    <label
                      htmlFor={`questao${questao.id}-alt${altIndex}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !provaFinalizada) {
                          handleResposta(questao.id, alt);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minHeight: "40px",
                        width: "100%",
                        padding: "5px 10px",
                        margin: "5px",
                        border: "1px solid black",
                        borderRadius: "5px",
                        cursor: "pointer",
                        backgroundColor: isCorrect
                          ? "green"
                          : isIncorrect
                          ? "red"
                          : isMarked
                          ? "gray"
                          : "white",
                        color: isCorrect || isIncorrect ? "white" : "black",
                      }}
                      aria-label={ariaLabel}
                    >
                      {letrasAlternativas[altIndex]}: {alt}
                    </label>
                  </div>
                );
              })}
          </section>
        ))}
        {!provaFinalizada && (
          <button
            style={{
              marginTop: "30px",
              backgroundColor: "darkred",
              color: "white",
              borderRadius: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              border: "none",
            }}
            onClick={finalizarProva}
            aria-label="Finalizar Prova"
            tabIndex={provaFinalizada ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !provaFinalizada) {
                finalizarProva();
              }
            }}
          >
            Finalizar Prova
          </button>
        )}
        {provaFinalizada && (
          <section tabIndex={0}>
            <br />
            <h2>{pontuacao} acertos.</h2>
            {Object.keys(errosPorMateria).length > 0 && (
              <div>
                <br />
                <h2>Erros por Matéria:</h2>
                <ul>
                  {Object.entries(errosPorMateria).map(([materia, erros]) => (
                    <li key={materia}>
                      {erros} em {materia}.
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <br />
            <h2>
              Tempo utilizado: {Math.floor(tempoFinalizacao / 60)}:
              {tempoFinalizacao % 60 < 10
                ? `0${tempoFinalizacao % 60}`
                : tempoFinalizacao % 60}
              .
            </h2>
          </section>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { subjects, questionCount } = context.query;
  const materias = subjects.split(",");
  const count = parseInt(questionCount, 10) || 10;
  const dados = await fetchFromDatabase(materias, count);
  return { props: { dados } };
}
