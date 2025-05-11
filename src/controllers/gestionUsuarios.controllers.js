import { pool } from '../db.js';

// Obtener usuarios
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * from empleado`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error interno del servidor");
  }
};