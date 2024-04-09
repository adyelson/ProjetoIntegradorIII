/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
  INSERT INTO perguntas (enunciado, resposta, outras_alternativas, materia)
  VALUES 
    ('Qual é o principal objetivo da dissertação argumentativa?', 'Defender um ponto de vista utilizando argumentos e evidências.', ARRAY['Informar', 'Persuadir', 'Entertar'], 'Português'),
    ('Qual é a fórmula para calcular a área de um triângulo?', 'Área = (base x altura) / 2', ARRAY['Área = base x altura', 'Área = (base + altura) / 2', 'Área = (base - altura) / 2'], 'Matemática'),
    ('Como a velocidade média de um objeto é calculada?', 'Velocidade média = distância total percorrida / intervalo de tempo', ARRAY['Velocidade média = distância percorrida x tempo', 'Velocidade média = distância total / tempo', 'Velocidade média = tempo / distância total'], 'Física'),
    ('Qual é o papel das mitocôndrias nas células?', 'Produção de energia (ATP) através da respiração celular.', ARRAY['Produção de proteínas', 'Armazenamento de água', 'Eliminação de resíduos'], 'Biologia'),
    ('Qual é a diferença entre uma reação química endotérmica e exotérmica?', 'Na reação endotérmica, a energia é absorvida do ambiente. Na reação exotérmica, a energia é liberada para o ambiente.', ARRAY['Aumento de massa', 'Liberação de calor', 'Nenhum dos anteriores'], 'Química'),
    ('Como se forma o plural dos substantivos em inglês?', 'Adicionando "s" ao final da palavra na maioria dos casos.', ARRAY['Adicionando "es"', 'Não há plural em inglês', 'Depende da letra final da palavra'], 'Inglês');  
  `);
};

exports.down = async (pgm) => {};
