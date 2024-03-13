/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.createTable("perguntas", {
    id: { type: "serial", primaryKey: true },
    enunciado: { type: "text", notNull: true },
    resposta: { type: "text", notNull: true },
    outras_alternativas: { type: "text[]" },
    materia: { type: "text", notNull: true },
  });
};

exports.down = async (pgm) => {
  await pgm.dropTable("perguntas");
};
