import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function NovaPergunta() {
  const router = useRouter();
  const { id } = router.query;
  const [enunciado, setEnunciado] = useState("");
  const [resposta, setResposta] = useState("");
  const [outrasAlternativas, setOutrasAlternativas] = useState([]);
  const [materia, setMateria] = useState("");
  const [materiasOptions] = useState([
    "Física",
    "Biologia",
    "Química",
    "Inglês",
    "Matemática",
    "Português",
    "História",
    "Geografia",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const res = await fetch(`/api/v1/pergunta?id=${id}`);
          const data = await res.json();

          if (res.ok) {
            setEnunciado(data.enunciado);
            setResposta(data.resposta);
            setOutrasAlternativas(data.outras_alternativas || []);
            setMateria(data.materia);
          } else {
            console.error("Erro ao obter dados da pergunta:", data.message);
          }
        } catch (error) {
          console.error("Erro ao obter dados da pergunta:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  const resetForm = () => {
    setEnunciado("");
    setResposta("");
    setOutrasAlternativas([]);
    setMateria("");
  };
  const handleVoltar = () => {
    router.push("/admin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { id, enunciado, resposta, outrasAlternativas, materia };

    try {
      const res = await fetch("/api/v1/novapergunta", {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Pergunta criada/atualizada:", result);
        // Redirecionar para página de sucesso, por exemplo
        if (!id) {
          router.push("/novapergunta");
          resetForm(); // Limpa os inputs após o envio do formulário
        } else {
          router.push("/admin");
        }
      } else {
        console.error("Erro ao criar/atualizar pergunta:", res.statusText);
      }
    } catch (error) {
      console.error("Erro ao criar/atualizar pergunta:", error);
    }
  };

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
      </div>
      <h1>{id ? "Editar Pergunta" : "Criar Nova Pergunta"}</h1>
      <br></br>
      <form onSubmit={handleSubmit}>
        <label>
          Enunciado:<br></br>
          <textarea
            style={{ minWidth: "300px" }}
            type="text"
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
            rows={4} // Defina o número de linhas desejado
            required
          />
        </label>
        <br />
        <label>
          Resposta:<br></br>
          <textarea
            style={{ minWidth: "300px" }}
            type="text"
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            rows={4} // Defina o número de linhas desejado
            required
          />
        </label>
        <br />
        <label>
          Outras Alternativas, somente as erradas (separadas por ///):<br></br>
          <textarea
            value={outrasAlternativas.join(",")}
            onChange={(e) => setOutrasAlternativas(e.target.value.split("///"))}
            rows={7} // Defina o número de linhas desejado
            style={{ minWidth: "300px" }} // Defina o mínimo de largura desejado
            required
          />
        </label>
        <br />
        <label>
          Matéria:<br></br>
          <select
            style={{ minWidth: "300px" }}
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            required
          >
            <option value="">Selecione uma matéria</option>
            {materiasOptions.map((materiaOption) => (
              <option key={materiaOption} value={materiaOption}>
                {materiaOption}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br></br>
        <button style={{ height: "30px", minWidth: "300px" }} type="submit">
          {id ? "Editar" : "Criar"}
        </button>
      </form>

      <button
        style={{ marginTop: "10px", minWidth: "300px" }}
        type="button"
        onClick={handleVoltar}
      >
        {"Voltar"}
      </button>
    </div>
  );
}
