import { useState } from "react";
import { useRouter } from "next/router"; // Importando o hook useRouter para acessar o roteador

export default function Home() {
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const subjects = [
    "Todas",
    "Física",
    "Biologia",
    "Química",
    "Inglês",
    "Matemática",
    "Português",
    "História",
    "Geografia",
  ];

  const router = useRouter(); // Obtendo o objeto de roteamento

  const handleSubjectChange = (subject) => {
    if (subject === "Todas") {
      if (selectedSubjects.includes("Todas")) {
        setSelectedSubjects([]);
      } else {
        setSelectedSubjects([...subjects.filter((item) => item)]);
      }
    } else {
      setSelectedSubjects((prevSelected) => {
        if (prevSelected.includes("Todas")) {
          if (prevSelected.length === 1) {
            return [subject];
          } else {
            return prevSelected.filter(
              (item) => item !== subject && item !== "Todas",
            );
          }
        } else if (prevSelected.includes(subject)) {
          return prevSelected.filter((item) => item !== subject);
        } else {
          return [...prevSelected, subject];
        }
      });
    }
  };

  const handleQuestionCountChange = (e) => {
    setQuestionCount(parseInt(e.target.value, 10));
  };

  const handleSubmit = () => {
    // Aqui você pode enviar os dados para a rota /questionario/index.js
    console.log("Matérias selecionadas:", selectedSubjects);
    console.log("Quantidade de questões:", questionCount);
    // Implemente o envio real dos dados aqui

    // Navegando para a rota /questionario e passando os dados como query params
    router.push({
      pathname: "/questionario",
      query: {
        subjects: selectedSubjects.join(","), // Convertendo o array de matérias em uma string separada por vírgula
        questionCount: questionCount.toString(), // Convertendo a quantidade de questões para string
      },
    });
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center", // Alinha o conteúdo verticalmente
      }}
    >
      <h1
        style={{
          margin: "0px",
          backgroundColor: "darkred",
          width: "100%",
          color: "white",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        Sistema de provas para vestibular
      </h1>
      <div>
        <h2 style={{ color: "black", marginBottom: "20px" }}>
          Selecione as Matérias e a Quantidade de Questões
        </h2>
        {subjects.map((subject) => (
          <span style={{ margin: "5px" }} key={subject}>
            <label>
              <input
                type="checkbox"
                checked={selectedSubjects.includes(subject)}
                onChange={() => handleSubjectChange(subject)}
              />
              {subject}
            </label>
          </span>
        ))}
        <div>
          <h3 style={{ color: "white" }}>Matérias selecionadas:</h3>
          {selectedSubjects
            .filter((subject) => subject !== "Todas")
            .map((subject) => (
              <span key={subject}>{subject} - </span>
            ))}
        </div>
      </div>
      <br></br>
      <div>
        <label style={{ color: "black" }}>
          Quantidade de Questões:
          <input
            type="number"
            value={questionCount}
            onChange={handleQuestionCountChange}
          />
        </label>
      </div>
      <br></br>
      <button
        style={{
          backgroundColor: "darkred",
          color: "white",
          borderRadius: "10px", // Adicionando bordas arredondadas
          padding: "10px 20px", // Adicionando preenchimento interno
          fontSize: "16px", // Tamanho da fonte
          cursor: "pointer", // Alterando o cursor ao passar o mouse
          border: "none", // Removendo a borda padrão
        }}
        onClick={handleSubmit}
      >
        Iniciar Prova
      </button>
    </div>
  );
}
