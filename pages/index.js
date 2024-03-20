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
    <div>
      <h1>Selecione as Matérias e a Quantidade de Questões</h1>
      <div>
        <h2>Escolha suas matérias:</h2>
        {subjects.map((subject) => (
          <label key={subject}>
            <input
              type="checkbox"
              checked={selectedSubjects.includes(subject)}
              onChange={() => handleSubjectChange(subject)}
            />
            {subject}
          </label>
        ))}
        <div>
          <h3>Matérias selecionadas:</h3>
          <ul>
            {selectedSubjects
              .filter((subject) => subject !== "Todas")
              .map((subject) => (
                <li key={subject}>{subject}</li>
              ))}
          </ul>
        </div>
      </div>
      <div>
        <label>
          Quantidade de Questões:
          <input
            type="number"
            value={questionCount}
            onChange={handleQuestionCountChange}
          />
        </label>
      </div>
      <button onClick={handleSubmit}>Iniciar Prova</button>
    </div>
  );
}
