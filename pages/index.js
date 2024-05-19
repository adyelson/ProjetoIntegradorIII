import { useState } from "react";
import { useRouter } from "next/router";

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

  const router = useRouter();

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
    console.log("Matérias selecionadas:", selectedSubjects);
    console.log("Quantidade de questões:", questionCount);
    router.push({
      pathname: "/questionario",
      query: {
        subjects: selectedSubjects.join(","),
        questionCount: questionCount.toString(),
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
        justifyContent: "center",
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
            <label htmlFor={`checkbox-${subject}`}>
              <input
                type="checkbox"
                id={`checkbox-${subject}`}
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
        <label htmlFor="input-question-count" style={{ color: "black" }}>
          Quantidade de Questões:
          <input
            type="number"
            id="input-question-count"
            value={questionCount}
            onChange={handleQuestionCountChange}
            min="1"
            step="1"
          />
        </label>
      </div>
      <br></br>
      <button
        style={{
          backgroundColor: "darkred",
          color: "white",
          borderRadius: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          border: "none",
        }}
        onClick={handleSubmit}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        tabIndex="0"
      >
        Iniciar Prova
      </button>
    </div>
  );
}
