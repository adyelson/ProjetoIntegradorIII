import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function NovaPergunta() {
  const router = useRouter();
  const { id } = router.query;
  const [enunciado, setEnunciado] = useState("");
  const [resposta, setResposta] = useState("");
  const [outrasAlternativas, setOutrasAlternativas] = useState([]);
  const [materia, setMateria] = useState("");

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
        router.push("/admin");
      } else {
        console.error("Erro ao criar/atualizar pergunta:", res.statusText);
      }
    } catch (error) {
      console.error("Erro ao criar/atualizar pergunta:", error);
    }
  };

  return (
    <div>
      <h1>{id ? "Editar Pergunta" : "Criar Nova Pergunta"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enunciado:
          <input
            type="text"
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Resposta:
          <input
            type="text"
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Outras Alternativas (separadas por vírgula):
          <input
            type="text"
            value={outrasAlternativas.join(",")}
            onChange={(e) => setOutrasAlternativas(e.target.value.split(","))}
          />
        </label>
        <br />
        <label>
          Matéria:
          <input
            type="text"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">{id ? "Editar" : "Criar"}</button>
      </form>
    </div>
  );
}
