const express = require("express");
const {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} = require("../controllers/libro.controller");

const router = express.Router();

/**
 * @openapi
 * /libros:
 *   get:
 *     tags:
 *       - Libros
 *     summary: Listar libros
 *     description: Lista todos los libros o filtra por genero con query param.
 *     parameters:
 *       - in: query
 *         name: genero
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra por genero exacto (ej. ficcion, historia, tecnologia).
 *         example: ficcion
 *     responses:
 *       200:
 *         description: Lista de libros.
 *         content:
 *           application/json:
 *             examples:
 *               allBooks:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       titulo: Cien anos de soledad
 *                       isbn: "9780307474728"
 *                       genero: ficcion
 *                       anio_publicacion: 1967
 *                       autor_id: 1
 *                       created_at: "2026-05-09T18:00:00.000Z"
 *                       autor:
 *                         id: 1
 *                         nombre: Gabriel Garcia Marquez
 *                     - id: 3
 *                       titulo: Fundacion
 *                       isbn: "9780553293357"
 *                       genero: ciencia ficcion
 *                       anio_publicacion: 1951
 *                       autor_id: 2
 *                       created_at: "2026-05-09T18:00:00.000Z"
 *                       autor:
 *                         id: 2
 *                         nombre: Isaac Asimov
 *               byGenre:
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: 1
 *                       titulo: Cien anos de soledad
 *                       isbn: "9780307474728"
 *                       genero: ficcion
 *                       anio_publicacion: 1967
 *                       autor_id: 1
 *                       created_at: "2026-05-09T18:00:00.000Z"
 *                       autor:
 *                         id: 1
 *                         nombre: Gabriel Garcia Marquez
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBROS_LIST_ERROR
 *                 message: Error al listar libros
 */
router.get("/", getAllLibros);

/**
 * @openapi
 * /libros/{id}:
 *   get:
 *     tags:
 *       - Libros
 *     summary: Obtener libro por ID
 *     description: Devuelve un libro con datos del autor.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Libro encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 3
 *                 titulo: Fundacion
 *                 isbn: "9780553293357"
 *                 genero: ciencia ficcion
 *                 anio_publicacion: 1951
 *                 autor_id: 2
 *                 created_at: "2026-05-09T18:00:00.000Z"
 *                 autor:
 *                   id: 2
 *                   nombre: Isaac Asimov
 *       400:
 *         description: ID invalido.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: INVALID_ID
 *                 message: ID de libro invalido
 *       404:
 *         description: Libro no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_NOT_FOUND
 *                 message: Libro no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_GET_ERROR
 *                 message: Error al consultar libro
 */
router.get("/:id", getLibroById);

/**
 * @openapi
 * /libros:
 *   post:
 *     tags:
 *       - Libros
 *     summary: Crear libro
 *     description: Crea un libro asociado a un autor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LibroInput"
 *           example:
 *             titulo: Yo, robot
 *             isbn: "9780553382563"
 *             genero: ciencia ficcion
 *             anio_publicacion: 1950
 *             autor_id: 2
 *     responses:
 *       201:
 *         description: Libro creado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 11
 *                 titulo: Yo, robot
 *                 isbn: "9780553382563"
 *                 genero: ciencia ficcion
 *                 anio_publicacion: 1950
 *                 autor_id: 2
 *                 created_at: "2026-05-09T18:30:00.000Z"
 *       400:
 *         description: Body invalido, autor no existente o ISBN duplicado.
 *         content:
 *           application/json:
 *             examples:
 *               invalidBody:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INVALID_BODY
 *                     message: Los campos titulo, isbn, genero y autor_id son obligatorios
 *               authorNotFound:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: AUTOR_NOT_FOUND
 *                     message: El autor_id no existe
 *               isbnDuplicate:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: ISBN_DUPLICATE
 *                     message: El isbn ya existe
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_CREATE_ERROR
 *                 message: Error al crear libro
 */
router.post("/", createLibro);

/**
 * @openapi
 * /libros/{id}:
 *   put:
 *     tags:
 *       - Libros
 *     summary: Actualizar libro
 *     description: Actualiza un libro por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LibroInput"
 *           example:
 *             titulo: Fundacion
 *             isbn: "9780553293357"
 *             genero: ciencia ficcion
 *             anio_publicacion: 1951
 *             autor_id: 2
 *     responses:
 *       200:
 *         description: Libro actualizado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 3
 *                 titulo: Fundacion
 *                 isbn: "9780553293357"
 *                 genero: ciencia ficcion
 *                 anio_publicacion: 1951
 *                 autor_id: 2
 *                 created_at: "2026-05-09T18:00:00.000Z"
 *       400:
 *         description: ID/body invalido, autor no existente o ISBN duplicado.
 *         content:
 *           application/json:
 *             examples:
 *               invalidBody:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INVALID_BODY
 *                     message: Los campos titulo, isbn, genero y autor_id son obligatorios
 *               invalidId:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INVALID_ID
 *                     message: ID de libro invalido
 *       404:
 *         description: Libro no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_NOT_FOUND
 *                 message: Libro no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_UPDATE_ERROR
 *                 message: Error al actualizar libro
 */
router.put("/:id", updateLibro);

/**
 * @openapi
 * /libros/{id}:
 *   delete:
 *     tags:
 *       - Libros
 *     summary: Eliminar libro
 *     description: Elimina un libro por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Libro eliminado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 message: Libro eliminado
 *       400:
 *         description: ID invalido.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: INVALID_ID
 *                 message: ID de libro invalido
 *       404:
 *         description: Libro no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_NOT_FOUND
 *                 message: Libro no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: LIBRO_DELETE_ERROR
 *                 message: Error al eliminar libro
 */
router.delete("/:id", deleteLibro);

module.exports = router;
