exports.shorthands = undefined;

exports.up = async (pgm) => {
  try {
    const data = await pgm.db.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE table_name = 'perguntas';
    `);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

exports.down = (pgm) => {
  // Revert logic if necessary
};
