module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "Autor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "autores",
      timestamps: false,
    }
  );
