const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const port = Number(process.env.PORT || 4040);
const apiBaseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Librería API",
      version: "1.0.0",
      description:
        "API REST para gestionar autores y libros usando Node.js, Express, Sequelize y PostgreSQL.",
    },
    servers: [
      {
        url: apiBaseUrl,
        description: "Servidor API",
      },
    ],
    components: {
      schemas: {
        AutorInput: {
          type: "object",
          required: ["nombre"],
          properties: {
            nombre: {
              type: "string",
              example: "Gabriel Garcia Marquez",
            },
            biografia: {
              type: "string",
              example: "Novelista y periodista colombiano.",
            },
          },
        },
        LibroInput: {
          type: "object",
          required: ["titulo", "isbn", "genero", "autor_id"],
          properties: {
            titulo: {
              type: "string",
              example: "Fundacion",
            },
            isbn: {
              type: "string",
              example: "9780553293357",
            },
            genero: {
              type: "string",
              example: "ciencia ficcion",
            },
            anio_publicacion: {
              type: "integer",
              example: 1951,
            },
            autor_id: {
              type: "integer",
              example: 2,
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerSpec,
};
