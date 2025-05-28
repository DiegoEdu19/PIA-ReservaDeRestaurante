import { pool } from '../db.js';

export const getEmpleados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM empleado JOIN rol ON empleado.id_rol = rol.id_rol"
    );
    console.log(JSON.stringify(result.rows, null, 2));
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const agregarEmpleado = async (req, res) => {
  try {
    const { nombre, apellidos, correo, telefono, contrasena, id_rol, id_restaurante } = req.body;

    // Validación simple
    if (!nombre || !apellidos || !correo || !telefono || !contrasena || !id_rol || !id_restaurante) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    // Validación de correo duplicado
    const correoExiste = await pool.query('SELECT 1 FROM empleado WHERE correo = $1', [correo]);
    if (correoExiste.rowCount > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado." });
    }

    // Validación de teléfono duplicado
    const telefonoExiste = await pool.query('SELECT 1 FROM empleado WHERE telefono = $1', [telefono]);
    if (telefonoExiste.rowCount > 0) {
      return res.status(400).json({ mensaje: "El teléfono ya está registrado." });
    }

    // Validación de nombre y apellidos duplicados
    const nombreExiste = await pool.query(
      'SELECT 1 FROM empleado WHERE nombre = $1 AND apellidos = $2',
      [nombre, apellidos]
    );
    if (nombreExiste.rowCount > 0) {
      return res.status(400).json({ mensaje: "Ya existe un empleado con ese nombre y apellidos." });
    }

    // Si pasa todas las validaciones, insertar
    const query = `
      INSERT INTO empleado (nombre, apellidos, correo, telefono, contrasena, id_rol, id_restaurante)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [nombre, apellidos, correo, telefono, contrasena, id_rol, id_restaurante];
    const result = await pool.query(query, values);

    res.status(201).json({ mensaje: "Empleado agregado correctamente", empleado: result.rows[0] });

  } catch (error) {
    console.error("Error al agregar empleado:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", detalle: error.message });
  }
};

export const editarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, correo, telefono, contrasena, id_rol, id_restaurante } = req.body;

    if (!id) return res.status(400).json({ mensaje: "ID requerido" });

    // Opcional: validar campos obligatorios, etc.

    // Puedes hacer lógica para no actualizar la contraseña si viene vacía
    let query, params;
    if (contrasena && contrasena.trim() !== '') {
      query = `UPDATE empleado 
               SET nombre=$1, apellidos=$2, correo=$3, telefono=$4, contrasena=$5, id_rol=$6, id_restaurante=$7
               WHERE id_empleado=$8 RETURNING *`;
      params = [nombre, apellidos, correo, telefono, contrasena, id_rol, id_restaurante, id];
    } else {
      query = `UPDATE empleado 
               SET nombre=$1, apellidos=$2, correo=$3, telefono=$4, id_rol=$5, id_restaurante=$6
               WHERE id_empleado=$7 RETURNING *`;
      params = [nombre, apellidos, correo, telefono, id_rol, id_restaurante, id];
    }

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json({ mensaje: "Empleado actualizado correctamente", empleado: result.rows[0] });

  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const obtenerRestaurantes = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_restaurante AS id, nombre FROM restaurante'); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener restaurantes:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

export const obtenerRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_rol AS id, descripcion AS nombre FROM rol'); 
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el id exista
    if (!id) {
      return res.status(400).json({ mensaje: "ID de empleado es requerido" });
    }

    // Ejecutar eliminación
    const result = await pool.query('DELETE FROM empleado WHERE id_empleado = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json({ mensaje: "Empleado eliminado correctamente", empleado: result.rows[0] });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", detalle: error.message });
  }
};

export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ mensaje: "ID requerido" });

    const result = await pool.query('SELECT * FROM empleado WHERE id_empleado = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener empleado:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
