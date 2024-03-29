import { useState, useEffect } from "react"; // Importe também o useEffect aqui
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
  const [alternativasEmbaralhadas, setAlternativasEmbaralhadas] = useState([]); // Estado para armazenar as alternativas embaralhadas
  const [timer, setTimer] = useState(0); // Inicializando o timer com 30 minutos (em segundos)
  const [currentQuestion, setCurrentQuestion] = useState(0); // Estado para controlar a pergunta atual

  // Função para embaralhar as alternativas quando necessário
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

  // Chamada da função para embaralhar as alternativas ao montar o componente
  useEffect(() => {
    embaralharAlternativas();

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [dados]);

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

  const letrasAlternativas = ["A", "B", "C", "D"]; // Array de letras para as alternativas

  return (
    <div
      style={{
        margin: "0px", // Centraliza o conteúdo horizontalmente
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
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Tempo decorrido: {Math.floor(timer / 60)}:
          {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
        </p>
      </div>
      {dados.map((questao, index) => (
        <div style={{ width: "100%", maxWidth: "600px" }} key={questao.id}>
          <h2 style={{ padding: "10px" }}>
            {index + 1}. {questao.enunciado}
          </h2>
          {alternativasEmbaralhadas[questao.id] &&
            alternativasEmbaralhadas[questao.id].map((alt, altIndex) => (
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
                  style={{ display: "none" }} // Oculta o input
                />
                <label
                  htmlFor={`questao${questao.id}-alt${altIndex}`}
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
                    backgroundColor:
                      respostas[questao.id] === alt ? "gray" : "white",
                  }}
                >
                  {letrasAlternativas[altIndex]}: {alt}
                </label>
              </div>
            ))}
        </div>
      ))}
      {!provaFinalizada && (
        <button
          style={{
            marginTop: "30px",
            backgroundColor: "darkred",
            color: "white",
            borderRadius: "10px", // Adicionando bordas arredondadas
            padding: "10px 20px", // Adicionando preenchimento interno
            fontSize: "16px", // Tamanho da fonte
            cursor: "pointer", // Alterando o cursor ao passar o mouse
            border: "none", // Removendo a borda padrão
          }}
          onClick={finalizarProva}
        >
          Finalizar Prova
        </button>
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
  return { props: { dados } };
}
