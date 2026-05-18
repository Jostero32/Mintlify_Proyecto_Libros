const { Op } = require("sequelize");
const { Libro, Autor } = require("../config/database");

function sendSuccess(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

function sendError(res, statusCode, code, message) {
  return res.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

async function getAllLibros(req, res) {
  try {
    const genero = typeof req.query.genero === "string" ? req.query.genero.trim() : "";
    const where = genero ? { genero: { [Op.iLike]: genero } } : {};

    const libros = await Libro.findAll({
      where,
      include: [
        {
          model: Autor,
          as: "autor",
          attributes: ["id", "nombre"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return sendSuccess(res, 200, libros);
  } catch (_error) {
    return sendError(res, 500, "LIBROS_LIST_ERROR", "Error al listar libros");
  }
}

async function getLibroById(req, res) {
  try {
    const libroId = parseId(req.params.id);
    if (!libroId) {
      return sendError(res, 400, "INVALID_ID", "ID de libro invalido");
    }

    const libro = await Libro.findByPk(libroId, {
      include: [
        {
          model: Autor,
          as: "autor",
          attributes: ["id", "nombre"],
        },
      ],
    });

    if (!libro) {
      return sendError(res, 404, "LIBRO_NOT_FOUND", "Libro no encontrado");
    }

    return sendSuccess(res, 200, libro);
  } catch (_error) {
    return sendError(res, 500, "LIBRO_GET_ERROR", "Error al consultar libro");
  }
}

async function createLibro(req, res) {
  try {
    const {
      titulo,
      isbn,
      genero,
      anio_publicacion: anioPublicacion,
      autor_id: autorId,
    } = req.body;

    if (
      !titulo ||
      !isbn ||
      !genero ||
      !autorId ||
      typeof titulo !== "string" ||
      typeof isbn !== "string" ||
      typeof genero !== "string"
    ) {
      return sendError(
        res,
        400,
        "INVALID_BODY",
        "Los campos titulo, isbn, genero y autor_id son obligatorios"
      );
    }

    const libro = await Libro.create({
      titulo: titulo.trim(),
      isbn: isbn.trim(),
      genero: genero.trim(),
      anio_publicacion: anioPublicacion || null,
      autor_id: autorId,
    });

    return sendSuccess(res, 201, libro);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return sendError(res, 400, "AUTOR_NOT_FOUND", "El autor_id no existe");
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return sendError(res, 400, "ISBN_DUPLICATE", "El isbn ya existe");
    }
    return sendError(res, 500, "LIBRO_CREATE_ERROR", "Error al crear libro");
  }
}

async function updateLibro(req, res) {
  try {
    const libroId = parseId(req.params.id);
    if (!libroId) {
      return sendError(res, 400, "INVALID_ID", "ID de libro invalido");
    }

    const {
      titulo,
      isbn,
      genero,
      anio_publicacion: anioPublicacion,
      autor_id: autorId,
    } = req.body;

    if (
      !titulo ||
      !isbn ||
      !genero ||
      !autorId ||
      typeof titulo !== "string" ||
      typeof isbn !== "string" ||
      typeof genero !== "string"
    ) {
      return sendError(
        res,
        400,
        "INVALID_BODY",
        "Los campos titulo, isbn, genero y autor_id son obligatorios"
      );
    }

    const libro = await Libro.findByPk(libroId);
    if (!libro) {
      return sendError(res, 404, "LIBRO_NOT_FOUND", "Libro no encontrado");
    }

    await libro.update({
      titulo: titulo.trim(),
      isbn: isbn.trim(),
      genero: genero.trim(),
      anio_publicacion: anioPublicacion || null,
      autor_id: autorId,
    });

    return sendSuccess(res, 200, libro);
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return sendError(res, 400, "AUTOR_NOT_FOUND", "El autor_id no existe");
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return sendError(res, 400, "ISBN_DUPLICATE", "El isbn ya existe");
    }
    return sendError(res, 500, "LIBRO_UPDATE_ERROR", "Error al actualizar libro");
  }
}

async function deleteLibro(req, res) {
  try {
    const libroId = parseId(req.params.id);
    if (!libroId) {
      return sendError(res, 400, "INVALID_ID", "ID de libro invalido");
    }

    const libro = await Libro.findByPk(libroId);
    if (!libro) {
      return sendError(res, 404, "LIBRO_NOT_FOUND", "Libro no encontrado");
    }

    await libro.destroy();
    return sendSuccess(res, 200, { message: "Libro eliminado" });
  } catch (_error) {
    return sendError(res, 500, "LIBRO_DELETE_ERROR", "Error al eliminar libro");
  }
}

module.exports = {
  getAllLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
};
