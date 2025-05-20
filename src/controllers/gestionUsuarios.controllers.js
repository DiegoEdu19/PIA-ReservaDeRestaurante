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
    const { nombre, apellidos, correo, telefono, contrasena, id_rol, id_restaurante } = req.body;

    // Validación simple
    if (!nombre || !apellidos || !correo || !telefono || !contrasena || !id_rol || !id_restaurante) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

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
    res.status(500).send("Error interno del servidor");
  }
};

export const editarEmpleado = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Error al editar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).send("Error interno del servidor");
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
