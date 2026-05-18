const express = require("express");
const {
  getAllAutores,
  getAutorById,
  createAutor,
  updateAutor,
  deleteAutor,
} = require("../controllers/autor.controller");

const router = express.Router();

/**
 * @openapi
 * /autores:
 *   get:
 *     tags:
 *       - Autores
 *     summary: Listar autores
 *     description: Devuelve todos los autores registrados.
 *     responses:
 *       200:
 *         description: Lista de autores.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   nombre: Gabriel Garcia Marquez
 *                   biografia: Novelista y periodista colombiano.
 *                   created_at: "2026-05-09T18:00:00.000Z"
 *                 - id: 2
 *                   nombre: Isaac Asimov
 *                   biografia: Escritor y bioquimico, referente de la ciencia ficcion.
 *                   created_at: "2026-05-09T18:00:00.000Z"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTORES_LIST_ERROR
 *                 message: Error al listar autores
 */
router.get("/", getAllAutores);

/**
 * @openapi
 * /autores/{id}:
 *   get:
 *     tags:
 *       - Autores
 *     summary: Obtener autor por ID
 *     description: Devuelve el autor correspondiente al ID enviado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Autor encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 nombre: Gabriel Garcia Marquez
 *                 biografia: Novelista y periodista colombiano.
 *                 created_at: "2026-05-09T18:00:00.000Z"
 *       400:
 *         description: ID invalido.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: INVALID_ID
 *                 message: ID de autor invalido
 *       404:
 *         description: Autor no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_NOT_FOUND
 *                 message: Autor no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_GET_ERROR
 *                 message: Error al consultar autor
 */
router.get("/:id", getAutorById);

/**
 * @openapi
 * /autores:
 *   post:
 *     tags:
 *       - Autores
 *     summary: Crear autor
 *     description: Crea un nuevo autor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AutorInput"
 *           example:
 *             nombre: Ursula K. Le Guin
 *             biografia: Autora de ficcion especulativa y fantasia.
 *     responses:
 *       201:
 *         description: Autor creado correctamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 6
 *                 nombre: Ursula K. Le Guin
 *                 biografia: Autora de ficcion especulativa y fantasia.
 *                 created_at: "2026-05-09T18:20:00.000Z"
 *       400:
 *         description: Body invalido.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: INVALID_BODY
 *                 message: El campo nombre es obligatorio
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_CREATE_ERROR
 *                 message: Error al crear autor
 */
router.post("/", createAutor);

/**
 * @openapi
 * /autores/{id}:
 *   put:
 *     tags:
 *       - Autores
 *     summary: Actualizar autor
 *     description: Actualiza un autor existente por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AutorInput"
 *           example:
 *             nombre: Gabriel Garcia Marquez
 *             biografia: Autor de Cien anos de soledad.
 *     responses:
 *       200:
 *         description: Autor actualizado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 nombre: Gabriel Garcia Marquez
 *                 biografia: Autor de Cien anos de soledad.
 *                 created_at: "2026-05-09T18:00:00.000Z"
 *       400:
 *         description: ID o body invalido.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: INVALID_BODY
 *                 message: El campo nombre es obligatorio
 *       404:
 *         description: Autor no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_NOT_FOUND
 *                 message: Autor no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_UPDATE_ERROR
 *                 message: Error al actualizar autor
 */
router.put("/:id", updateAutor);

/**
 * @openapi
 * /autores/{id}:
 *   delete:
 *     tags:
 *       - Autores
 *     summary: Eliminar autor
 *     description: Elimina un autor por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Autor eliminado.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 message: Autor eliminado
 *       400:
 *         description: ID invalido o autor con libros asociados.
 *         content:
 *           application/json:
 *             examples:
 *               invalidId:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: INVALID_ID
 *                     message: ID de autor invalido
 *               hasBooks:
 *                 value:
 *                   success: false
 *                   error:
 *                     code: AUTOR_HAS_BOOKS
 *                     message: No se puede eliminar el autor porque tiene libros asociados
 *       404:
 *         description: Autor no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_NOT_FOUND
 *                 message: Autor no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error:
 *                 code: AUTOR_DELETE_ERROR
 *                 message: Error al eliminar autor
 */
router.delete("/:id", deleteAutor);

module.exports = router;
