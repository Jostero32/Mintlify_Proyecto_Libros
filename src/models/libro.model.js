module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "Libro",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      genero: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      anio_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      autor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "libros",
      timestamps: false,
    }
  );
