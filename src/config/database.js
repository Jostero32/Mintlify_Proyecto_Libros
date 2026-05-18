const { Sequelize, DataTypes } = require("sequelize");
const defineAutorModel = require("../models/autor.model");
const defineLibroModel = require("../models/libro.model");

const sequelize = new Sequelize(
  process.env.DB_NAME || "libreria",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "db",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
  }
);

const Autor = defineAutorModel(sequelize, DataTypes);
const Libro = defineLibroModel(sequelize, DataTypes);

Autor.hasMany(Libro, {
  foreignKey: "autor_id",
  as: "libros",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

Libro.belongsTo(Autor, {
  foreignKey: "autor_id",
  as: "autor",
});

async function initDatabase() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
}

module.exports = {
  sequelize,
  Autor,
  Libro,
  initDatabase,
};
