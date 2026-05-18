const { Autor } = require("../config/database");

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

async function getAllAutores(_req, res) {
  try {
    const autores = await Autor.findAll({
      order: [["id", "ASC"]],
    });
    return sendSuccess(res, 200, autores);
  } catch (_error) {
    return sendError(res, 500, "AUTORES_LIST_ERROR", "Error al listar autores");
  }
}

async function getAutorById(req, res) {
  try {
    const autorId = parseId(req.params.id);
    if (!autorId) {
      return sendError(res, 400, "INVALID_ID", "ID de autor invalido");
    }

    const autor = await Autor.findByPk(autorId);
    if (!autor) {
      return sendError(res, 404, "AUTOR_NOT_FOUND", "Autor no encontrado");
    }

    return sendSuccess(res, 200, autor);
  } catch (_error) {
    return sendError(res, 500, "AUTOR_GET_ERROR", "Error al consultar autor");
  }
}

async function createAutor(req, res) {
  try {
    const { nombre, biografia } = req.body;
    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return sendError(res, 400, "INVALID_BODY", "El campo nombre es obligatorio");
    }

    const autor = await Autor.create({
      nombre: nombre.trim(),
      biografia: biografia || null,
    });

    return sendSuccess(res, 201, autor);
  } catch (_error) {
    return sendError(res, 500, "AUTOR_CREATE_ERROR", "Error al crear autor");
  }
}

async function updateAutor(req, res) {
  try {
    const autorId = parseId(req.params.id);
    if (!autorId) {
      return sendError(res, 400, "INVALID_ID", "ID de autor invalido");
    }

    const { nombre, biografia } = req.body;
    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return sendError(res, 400, "INVALID_BODY", "El campo nombre es obligatorio");
    }

    const autor = await Autor.findByPk(autorId);
    if (!autor) {
      return sendError(res, 404, "AUTOR_NOT_FOUND", "Autor no encontrado");
    }

    await autor.update({
      nombre: nombre.trim(),
      biografia: biografia || null,
    });

    return sendSuccess(res, 200, autor);
  } catch (_error) {
    return sendError(res, 500, "AUTOR_UPDATE_ERROR", "Error al actualizar autor");
  }
}

async function deleteAutor(req, res) {
  try {
    const autorId = parseId(req.params.id);
    if (!autorId) {
      return sendError(res, 400, "INVALID_ID", "ID de autor invalido");
    }

    const autor = await Autor.findByPk(autorId);
    if (!autor) {
      return sendError(res, 404, "AUTOR_NOT_FOUND", "Autor no encontrado");
    }

    await autor.destroy();
    return sendSuccess(res, 200, { message: "Autor eliminado" });
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return sendError(
        res,
        400,
        "AUTOR_HAS_BOOKS",
        "No se puede eliminar el autor porque tiene libros asociados"
      );
    }
    return sendError(res, 500, "AUTOR_DELETE_ERROR", "Error al eliminar autor");
  }
}

module.exports = {
  getAllAutores,
  getAutorById,
  createAutor,
  updateAutor,
  deleteAutor,
};
