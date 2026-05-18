const { Autor, Libro } = require("./database");

const autoresSeed = [
  {
    id: 1,
    nombre: "Gabriel Garcia Marquez",
    biografia: "Novelista y periodista colombiano.",
  },
  {
    id: 2,
    nombre: "Isaac Asimov",
    biografia: "Escritor y bioquimico, referente de la ciencia ficcion.",
  },
  {
    id: 3,
    nombre: "Yuval Noah Harari",
    biografia: "Historiador y autor de ensayos sobre humanidad y futuro.",
  },
  {
    id: 4,
    nombre: "Ursula K. Le Guin",
    biografia: "Autora de ficcion especulativa y fantasia.",
  },
  {
    id: 5,
    nombre: "Robert C. Martin",
    biografia: "Ingeniero de software y autor tecnico.",
  },
];

const librosSeed = [
  {
    id: 1,
    titulo: "Cien anos de soledad",
    isbn: "9780307474728",
    genero: "ficcion",
    anio_publicacion: 1967,
    autor_id: 1,
  },
  {
    id: 2,
    titulo: "El amor en los tiempos del colera",
    isbn: "9780307389732",
    genero: "ficcion",
    anio_publicacion: 1985,
    autor_id: 1,
  },
  {
    id: 3,
    titulo: "Fundacion",
    isbn: "9780553293357",
    genero: "ciencia ficcion",
    anio_publicacion: 1951,
    autor_id: 2,
  },
  {
    id: 4,
    titulo: "Yo, robot",
    isbn: "9780553382563",
    genero: "ciencia ficcion",
    anio_publicacion: 1950,
    autor_id: 2,
  },
  {
    id: 5,
    titulo: "Sapiens: De animales a dioses",
    isbn: "9780062316110",
    genero: "historia",
    anio_publicacion: 2011,
    autor_id: 3,
  },
  {
    id: 6,
    titulo: "Homo Deus",
    isbn: "9780062464316",
    genero: "no ficcion",
    anio_publicacion: 2015,
    autor_id: 3,
  },
  {
    id: 7,
    titulo: "La mano izquierda de la oscuridad",
    isbn: "9780441478125",
    genero: "ciencia ficcion",
    anio_publicacion: 1969,
    autor_id: 4,
  },
  {
    id: 8,
    titulo: "Los desposeidos",
    isbn: "9780061054884",
    genero: "ficcion",
    anio_publicacion: 1974,
    autor_id: 4,
  },
  {
    id: 9,
    titulo: "Clean Code",
    isbn: "9780132350884",
    genero: "tecnologia",
    anio_publicacion: 2008,
    autor_id: 5,
  },
  {
    id: 10,
    titulo: "Clean Architecture",
    isbn: "9780134494166",
    genero: "tecnologia",
    anio_publicacion: 2017,
    autor_id: 5,
  },
];

async function runSeedIfEmpty() {
  const autoresCount = await Autor.count();
  const librosCount = await Libro.count();

  if (autoresCount > 0 || librosCount > 0) {
    return;
  }

  await Autor.bulkCreate(autoresSeed);
  await Libro.bulkCreate(librosSeed);
}

module.exports = {
  runSeedIfEmpty,
};
