/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  const data = await pgm.db.query(`
    SELECT * FROM perguntas;
  `);
  console.log(data.rows);
};

exports.down = (pgm) => {
  // Revert logic if necessary
};
