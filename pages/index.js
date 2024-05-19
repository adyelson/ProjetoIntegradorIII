import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [randomNewsArticle, setRandomNewsArticle] = useState(null);
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

  useEffect(() => {
    const fetchNews = async () => {
      const url = `/api/news`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.articles.length);
          setRandomNewsArticle(data.articles[randomIndex]);
        }
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNews();
  }, []);

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

      <br></br>
      <center
        style={{
          backgroundColor: "lightgray",
          width: "100%",
          height: "100%",
          padding: "30px",
        }}
      >
        <h2 style={{ color: "black", marginBottom: "20px" }}>Notícias</h2>
        {randomNewsArticle ? (
          <div style={{ maxWidth: "660px" }}>
            <h3>{randomNewsArticle.title}</h3>
            <img
              src={randomNewsArticle.urlToImage}
              alt={randomNewsArticle.title}
              style={{ maxWidth: "250px" }}
            />
            <p>{randomNewsArticle.description}</p>
            <a
              href={randomNewsArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Leia mais
            </a>
          </div>
        ) : (
          <p style={{ color: "black" }}>Carregando notícia...</p>
        )}
      </center>
    </div>
  );
}
