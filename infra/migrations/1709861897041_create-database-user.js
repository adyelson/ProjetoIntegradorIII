/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.createTable("users", {
    id: { type: "serial", primaryKey: true },
    login: { type: "text", notNull: true },
    password: { type: "text", notNull: true },
    email: { type: "text", notNull: true },
  });
};

exports.down = async (pgm) => {
  await pgm.dropTable("users");
};
