/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
    INSERT INTO perguntas (enunciado, resposta, outras_alternativas, materia)
    VALUES 
      ('Qual é a capital do Brasil?', 'Brasília', ARRAY['São Paulo', 'Rio de Janeiro', 'Salvador'], 'Geografia'),
      ('Quem descobriu o Brasil?', 'Pedro Álvares Cabral', ARRAY['Cristóvão Colombo', 'Amerigo Vespucci', 'Fernão de Magalhães'], 'História');
  `);
};

exports.down = async (pgm) => {};
