import { pool } from '../db.js';

export const getEmpleados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM empleado JOIN rol ON empleado.id_rol = rol.id_rol"
    );
    console.log(JSON.stringify(result, null, 2));
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const agregarEmpleado = async (req, res) => {
  try {
    const { nombre_empleado, apellido_empleado, correo_empleado, telefono_empleado, contrasena_empleado, id_rol, id_restaurante } = req.body;

    if (!nombre_empleado || !apellido_empleado || !correo_empleado || !telefono_empleado || !contrasena_empleado || !id_rol || !id_restaurante) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const empleadoDuplicado = await pool.query('SELECT id_empleado FROM empleado WHERE correo_empleado = $1', [correo_empleado]);
    if (empleadoDuplicado.rowCount > 0) {
      return res.status(403).send('Este correo ya está registrado');
    }

    const result = await pool.query(
      "INSERT INTO empleado (nombre_empleado, apellido_empleado, correo_empleado, telefono_empleado, contrasena_empleado, id_rol, id_restaurante) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [nombre_empleado, apellido_empleado, correo_empleado, telefono_empleado, contrasena_empleado, id_rol, id_restaurante]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const editarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_empleado, apellido_empleado, correo_empleado, telefono_empleado, contrasena_empleado, id_rol, id_restaurante } = req.body;

    if (!nombre_empleado || !apellido_empleado || !correo_empleado || !telefono_empleado || !contrasena_empleado || !id_rol || !id_restaurante) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const result = await pool.query(
      "UPDATE empleado SET nombre_empleado = $1, apellido_empleado = $2, correo_empleado = $3, telefono_empleado = $4, contrasena_empleado = $5, id_rol = $6, id_restaurante = $7 WHERE id_empleado = $8 RETURNING *",
      [nombre_empleado, apellido_empleado, correo_empleado, telefono_empleado, contrasena_empleado, id_rol, id_restaurante, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al editar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID inválido o no definido" });
    }

    const result = await pool.query(
      "DELETE FROM empleado WHERE id_empleado = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Empleado no encontrado o ya eliminado previamente.');
    }

    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};
